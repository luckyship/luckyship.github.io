---
layout: post
title: "在debian上使用kubeadm搭建 v1.16.3版本Kubernetes集群"
date: 2020-09-10
excerpt: "在debian上使用一键安装工具kubeadm安装kubernete环境，摆脱繁琐的k8s配置"
tags: [linux, kubernetes, debian]
comments: true
---

# 环境准备
debian 9 机器一台，作为master节点和node节点

## 首先安装docker
[离线安装docker](https://www.cnblogs.com/luoSteel/p/10038954.html)  
[docker 安装包下载地址](https://download.docker.com/linux/static/stable/x86_64/)  
### 解压
```
tar -xvf docker-18.06.1-ce.tgz
```
### 将解压出来的docker文件内容移动到 /usr/bin/ 目录下
```
cp docker/* /usr/bin/
```
### 将docker注册为service
```
vim /etc/systemd/system/docker.service
```
将下列配置复制到docker.service中并保存
```
[Unit]

Description=Docker Application Container Engine

Documentation=https://docs.docker.com

After=network-online.target firewalld.service

Wants=network-online.target

[Service]

Type=notify

# the default is not to use systemd for cgroups because the delegate issues still

# exists and systemd currently does not support the cgroup feature set required

# for containers run by docker

ExecStart=/usr/bin/dockerd

ExecReload=/bin/kill -s HUP $MAINPID

# Having non-zero Limit*s causes performance problems due to accounting overhead

# in the kernel. We recommend using cgroups to do container-local accounting.

LimitNOFILE=infinity

LimitNPROC=infinity

LimitCORE=infinity

# Uncomment TasksMax if your systemd version supports it.

# Only systemd 226 and above support this version.

#TasksMax=infinity

TimeoutStartSec=0

# set delegate yes so that systemd does not reset the cgroups of docker containers

Delegate=yes

# kill only the docker process, not all processes in the cgroup

KillMode=process

# restart the docker process if it exits prematurely

Restart=on-failure

StartLimitBurst=3

StartLimitInterval=60s

 

[Install]

WantedBy=multi-user.target
```
### 启动
```
chmod +x /etc/systemd/system/docker.service             #添加文件权限并启动docker
systemctl daemon-reload                                 #重载unit配置文件
systemctl start docker                                  #启动Docker
systemctl enable docker.service                         #设置开机自启
```
### 验证
```
systemctl status docker                                 #查看Docker状态
docker -v                                               #查看Docker版本
```

## 关闭swap、selinux、防火墙
```
swapoff -a

systemctl stop firewalld
```

## 添加k8s官方源
需要科学上网
```
sudo curl -s https://packages.cloud.google.com/apt/doc/apt-key.gpg | sudo apt-key add
sudo cat <<EOF >/etc/apt/sources.list.d/kubernetes.list
deb http://apt.kubernetes.io/ kubernetes-xenial main
EOF
sudo apt-get update
sudo apt-get install kubelet=1.16.3-00 kubeadm=1.16.3-00 kubectl=1.16.3-00 kubernetes-cni
```

# 使用kubeadm部署k8s
## 初始化环境
因为官方镜像比较慢，所以使用阿里镜像
```
$ kubeadm init \
    --image-repository registry.aliyuncs.com/google_containers \
    --kubernetes-version v1.16.3 \
    --pod-network-cidr=10.244.0.0/16
...
Your Kubernetes control-plane has initialized successfully!

To start using your cluster, you need to run the following as a regular user:

  mkdir -p $HOME/.kube
  sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
  sudo chown $(id -u):$(id -g) $HOME/.kube/config

You should now deploy a pod network to the cluster.
Run "kubectl apply -f [podnetwork].yaml" with one of the options listed at:
  https://kubernetes.io/docs/concepts/cluster-administration/addons/

You can now join any number of control-plane nodes by copying certificate authorities 
and service account keys on each node and then running the following as root:

  kubeadm join 192.168.9.10:6443 --token px979r.mphk9ee5ya8fgy44 \
    --discovery-token-ca-cert-hash sha256:5e7c7cd1cc1f86c0761e54b9380de22968b6b221cb98939c14ab2942223f6f51 \
    --control-plane 	  

Then you can join any number of worker nodes by running the following on each as root:

kubeadm join 192.168.9.10:6443 --token px979r.mphk9ee5ya8fgy44 \
    --discovery-token-ca-cert-hash sha256:5e7c7cd1cc1f86c0761e54b9380de22968b6b221cb98939c14ab2942223f6f51 

```
根据提示设置`kubeconfig`，或者添加子节点
## 设置k8s的网络插件
使用`kubectl get pods -A`发现`coredns`状态不是`running`，需要配置网络插件
```
$ kubectl apply -f "https://cloud.weave.works/k8s/net?k8s-version=$(kubectl version | base64 | tr -d '\n')"
```
## 安装helm
### 去除节点污点
只有一个master节点的情况下，master节点不允许运行资源，需要去掉污点
```
$ kubectl get nodes
NAME       STATUS   ROLES    AGE    VERSION
linx-dev   Ready    master   138m   v1.16.3

$ kubectl describe node linx-dev  | grep Taint
Taints:             node-role.kubernetes.io/master:NoSchedule

// 如果Taints是none，则不需要去除污点
kubectl taint nodes linx-dev node-role.kubernetes.io/master:NoSchedule-
```

### 下载客户端
```
wget https://get.helm.sh/helm-v2.16.3-linux-amd64.tar.gz
```
### 解压缩并拷贝helm二进制文件
```
tar xf helm-v2.16.3-linux-amd64.tar.gz
cp linux-amd64/helm /usr/local/bin
```
### 添加阿里云的仓库
```
helm init --client-only --stable-repo-url https://aliacs-app-catalog.oss-cn-hangzhou.aliyuncs.com/charts/
helm repo add incubator https://aliacs-app-catalog.oss-cn-hangzhou.aliyuncs.com/charts-incubator/
helm repo update
```
### 创建 Kubernetes 的服务帐号和绑定角色
```
// 创建serviceaccount
kubectl create serviceaccount --namespace kube-system tiller

// 创建角色绑定
kubectl create clusterrolebinding tiller-cluster-rule --clusterrole=cluster-admin --serviceaccount=kube-system:tiller
```
### 创建服务端 使用-i指定阿里云仓库
```
helm init --service-account tiller --upgrade -i registry.cn-hangzhou.aliyuncs.com/google_containers/tiller:v2.16.3  --stable-repo-url https://kubernetes.oss-cn-hangzhou.aliyuncs.com/charts
```

## 安装openebs存储服务
### 部署openebs
```
kubectl apply -f https://openebs.github.io/charts/openebs-operator-1.5.0.yaml
```
### 设置默认存储
```
$ kubectl patch storageclass openebs-hostpath -p '{"metadata": {"annotations":{"storageclass.kubernetes.io/is-default-class":"true"}}}'
storageclass.storage.k8s.io/openebs-hostpath patched
```
## 安装kubesphere

```
kubectl apply -f https://raw.githubusercontent.com/kubesphere/ks-installer/master/kubesphere-minimal.yaml
```

## 参考
[Helm离线安装](https://www.jianshu.com/p/2bb1dfdadee8)