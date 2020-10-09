---
layout: post
title: "在debian上离线使用kubeadm搭建 v1.16.3版本Kubernetes集群"
date: 2020-09-27
excerpt: "在debian上离线所有k8s资源，不需要网络安装kubernetes环境"
tags: [linux, kubernetes, debian]
comments: true
---

# 环境准备
debian 9 机器一台，作为master节点和node节点

## 首先安装docker
[离线安装docker](https://www.cnblogs.com/luoSteel/p/10038954.html)  
[docker 安装包下载地址](https://download.docker.com/linux/static/stable/x86_64/)

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
sudo apt-get install -y kubelet kubeadm kubectl kubernetes-cni
```

## 配置离线包
```
$ apt-get download kubeadm=1.16.3-00 
$ apt-get download kubelet=1.16.3-00 kubectl=1.16.3-00 kubernetes-cni
$ apt-get download socat ebtables conntrack
$ apt-get download cri-tools
$ apt-get download libnetfilter-conntrack3
$ apt-get download libssl1.1

$ dpkg -i xxxx.deb
```

## 导出docker 离线包
列出所有镜像
```
$ kubeadm config images list --image-repository registry.aliyuncs.com/google_containers --kubernetes-version v1.16.3
registry.aliyuncs.com/google_containers/kube-apiserver:v1.16.3
registry.aliyuncs.com/google_containers/kube-controller-manager:v1.16.3
registry.aliyuncs.com/google_containers/kube-scheduler:v1.16.3
registry.aliyuncs.com/google_containers/kube-proxy:v1.16.3
registry.aliyuncs.com/google_containers/pause:3.1
registry.aliyuncs.com/google_containers/etcd:3.3.15-0
registry.aliyuncs.com/google_containers/coredns:1.6.2

$ docker save xxx xxx xxx > k8s.tar
$ docker load < k8s.tar
```

# 使用kubeadm部署k8s
## 初始化环境
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
```
$ kubectl apply -f "https://cloud.weave.works/k8s/net?k8s-version=$(kubectl version | base64 | tr -d '\n')"
```

```
$ docker save weaveworks/weave-npc:2.7.0 weaveworks/weave-kube:2.7.0 > weave.tar
$ docker load < weave.tar
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
### 导出tiller镜像
```
docker save registry.cn-hangzhou.aliyuncs.com/google_containers/tiller:v2.16.3 > helm.tar
docker load < helm.tar
```

### 初始化helm，部署tiller
```
$ kubectl -n kube-system create serviceaccount tiller
$ kubectl create clusterrolebinding tiller --clusterrole cluster-admin –serviceaccount=kube-system:tiller
```
`--stable-repo-url http://10.16.48.44/`需要起一个http 服务，apache或者node都可以，这儿下面放了一个文件index.yaml文件，可以从这儿下载到https://kubernetes.oss-cn-hangzhou.aliyuncs.com/charts/index.yaml
```
$ helm init --service-account tiller --tiller-image=registry.cn-hangzhou.aliyuncs.com/google_containers/tiller:v2.16.3 --upgrade --stable-repo-url http://193.160.57.100
Creating /root/.helm/repository/repositories.yaml 
Adding stable repo with URL: http://193.160.57.100 
Adding local repo with URL: http://127.0.0.1:8879/charts 
$HELM_HOME has been configured at /root/.helm.

Tiller (the Helm server-side component) has been installed into your Kubernetes Cluster.

Please note: by default, Tiller is deployed with an insecure 'allow unauthenticated users' policy.
To prevent this, run `helm init` with the --tiller-tls-verify flag.
For more information on securing your installation see: https://docs.helm.sh/using_helm/#securing-your-helm-installation

```

## 安装openebs存储服务

### yaml文件
将其中的`imagePullPolicy`改为`IfNotPresent`，这样可以优先选择本地镜像，而不会去请求网络
```
https://openebs.github.io/charts/openebs-operator-1.5.0.yaml
```
### 导出所有openebs镜像
```
$ docker save quay.io/openebs/m-apiserver:1.5.0 quay.io/openebs/openebs-k8s-provisioner:1.5.0 quay.io/openebs/snapshot-controller:1.5.0 quay.io/openebs/snapshot-provisioner:1.5.0 quay.io/openebs/node-disk-manager-amd64:v0.4.5 quay.io/openebs/node-disk-operator-amd64:v0.4.5 quay.io/openebs/admission-server:1.5.0 quay.io/openebs/provisioner-localpv:1.5.0 quay.io/openebs/linux-utils:1.5.0 > openebs.tar

$ docker load < openebs.tar
```
```
kubectl apply -f openebs-operator-1.5.0.yaml
```
### 设置默认存储
```
$ kubectl patch storageclass openebs-hostpath -p '{"metadata": {"annotations":{"storageclass.kubernetes.io/is-default-class":"true"}}}'
storageclass.storage.k8s.io/openebs-hostpath patched
```
## 安装kubesphere

### 导入最小化镜像
```
docker load < ks_minimal_images.tar
```

### 安装kubesphere
```
kubectl apply -f kubesphere-minimal.yaml
```

## 参考
[Helm离线安装](https://www.jianshu.com/p/2bb1dfdadee8)