---
layout: post
title: "在centos7上使用kubeadm搭建 v1.16.9版本Kubernetes集群"
date: 2020-09-04
excerpt: "在centos上使用一键安装工具kubeadm安装kubernete环境，摆脱繁琐的k8s配置"
tags: [linux, kubernetes, centos]
comments: true
---

# 环境准备
## 实验环境
|角色|IP地址|主机名|docker版本|硬件配置|系统|内核|
|:----:|:----:|:----:|:----:|:----:|:----:|:----:|
|master|192.168.9.10|k8s-master|18.09.9|2c4g|CentOS7.7|3.10.0-1062.el7.x86_64|
node1|192.168.9.13|k8s-node1|18.09.9|2c6g|CentOS7.7|3.10.0-1062.el7.x86_64
node2|192.168.9.14|k8s-node2|18.09.9|2c6g|CentOS7.7|3.10.0-1062.el7.x86_64
## 每个节点配置host信息
```
cat >> /etc/hosts <<EOF
192.168.9.10 k8s-master
192.168.9.13 k8s-node1
192.168.9.14 k8s-node2
EOF
```
## 禁用防火墙和selinux
```
//禁用防火墙
systemctl stop firewalld && systemctl disable firewalld

//禁用selinux
#临时修改
setenforce 0

#永久修改，重启服务器后生效
sed -i '7s/enforcing/disabled/' /etc/selinux/config
```
## 创建```/etc/sysctl.d/k8s.conf```文件，添加如下内容
```
//向文件中写入以下内容
cat >/etc/sysctl.d/k8s.conf <<EOF
net.bridge.bridge-nf-call-ip6tables = 1
net.bridge.bridge-nf-call-iptables = 1
net.ipv4.ip_forward = 1
EOF

//执行以下命令生效
modprobe br_netfilter && sysctl -p /etc/sysctl.d/k8s.conf
```
## 安装ipvs
脚本创建了的```/etc/sysconfig/modules/ipvs.modules```文件，保证在节点重启后能自动加载所需模块。使用```lsmod | grep -e ip_vs -e nf_conntrack_ipv4```命令查看是否已经正确加载所需的内核模块
```
//向文件中写入以下内容
cat > /etc/sysconfig/modules/ipvs.modules <<EOF
#!/bin/bash
modprobe -- ip_vs
modprobe -- ip_vs_rr
modprobe -- ip_vs_wrr
modprobe -- ip_vs_sh
modprobe -- nf_conntrack_ipv4
EOF

//修改权限以及查看是否已经正确加载所需的内核模块
chmod 755 /etc/sysconfig/modules/ipvs.modules && bash /etc/sysconfig/modules/ipvs.modules && lsmod | grep -e ip_vs -e nf_conntrack_ipv4

nf_conntrack_ipv4      15053  0 
nf_defrag_ipv4         12729  1 nf_conntrack_ipv4
ip_vs_sh               12688  0 
ip_vs_wrr              12697  0 
ip_vs_rr               12600  0 
ip_vs                 145497  6 ip_vs_rr,ip_vs_sh,ip_vs_wrr
nf_conntrack          133095  2 ip_vs,nf_conntrack_ipv4
libcrc32c              12644  3 xfs,ip_vs,nf_conntrack
```
安装ipset和ipvsadm(便于查看 ipvs 的代理规则)
```
yum -y install ipset ipvsadm
```
## 关闭swap分区
修改```/etc/fstab```文件，注释掉 SWAP 的自动挂载，使用```free -m```确认 swap 已经关闭
```
//手动关闭swap
swapoff -a

//修改fstab文件，注释swap自动挂载
sed -i '/^\/dev\/mapper\/centos-swap/c#/dev/mapper/centos-swap swap                    swap    defaults        0 0' /etc/fstab

//查看swap是否关闭
free -m

total        used        free      shared  buff/cache   available
Mem:           1994         682         612           9         699        1086
Swap:             0           0           0
```
swappiness 参数调整，修改```/etc/sysctl.d/k8s.conf```添加下面一行
```
cat >>/etc/sysctl.d/k8s.conf <<EOF
vm.swappiness=0
EOF

//使配置生效
sysctl -p /etc/sysctl.d/k8s.conf

net.bridge.bridge-nf-call-ip6tables = 1
net.bridge.bridge-nf-call-iptables = 1
net.ipv4.ip_forward = 1
vm.swappiness = 0
```
## 安装docker18.09.9
1.添加阿里云yum源
```
yum-config-manager --add-repo http://mirrors.aliyun.com/docker-ce/linux/centos/docker-ce.repo
```
2.查看可用版本
```
yum list docker-ce --showduplicates | sort -r

已加载插件：fastestmirror, langpacks
可安装的软件包
 * updates: mirrors.aliyun.com
Loading mirror speeds from cached hostfile
 * extras: mirrors.aliyun.com
docker-ce.x86_64            3:19.03.5-3.el7                     docker-ce-stable
docker-ce.x86_64            3:19.03.4-3.el7                     docker-ce-stable
。。。。。。
docker-ce.x86_64            3:18.09.9-3.el7                     docker-ce-stable
docker-ce.x86_64            3:18.09.8-3.el7                     docker-ce-stable
docker-ce.x86_64            3:18.09.7-3.el7                     docker-ce-stable
docker-ce.x86_64            3:18.09.6-3.el7                     docker-ce-stable
。。。。。。
```
    
3.安装docker18.09.9
```
yum -y install docker-ce-18.09.9-3.el7 docker-ce-cli-18.09.9
```
4.启动docker并设置开机自启
```
systemctl enable docker && systemctl start docker
```
5.配置阿里云docker镜像加速
```
cat > /etc/docker/daemon.json <<-'EOF'
{
  "registry-mirrors": ["https://gqk8w9va.mirror.aliyuncs.com"]
}
EOF
```
6.配置完后重启docker
```
systemctl restart docker
```
7.查看加速
```
docker info

找到Registry Mirrors一行
Registry Mirrors:
 https://gqk8w9va.mirror.aliyuncs.com/
```

8.查看docker版本
docker version
```
Client:
 Version:           18.09.9
 API version:       1.39
 Go version:        go1.11.13
 Git commit:        039a7df9ba
 Built:             Wed Sep  4 16:51:21 2019
 OS/Arch:           linux/amd64
 Experimental:      false

Server: Docker Engine - Community
 Engine:
  Version:          18.09.9
  API version:      1.39 (minimum version 1.12)
  Go version:       go1.11.13
  Git commit:       039a7df
  Built:            Wed Sep  4 16:22:32 2019
  OS/Arch:          linux/amd64
  Experimental:     false
```
* 若有需要网络代理的，请在docker中配置网络代理，否则docker无法下载镜像
## 修改docker Cgroup Driver为systemd
```
#修改docker Cgroup Driver为systemd
将/usr/lib/systemd/system/docker.service文件中的这一行 ExecStart=/usr/bin/dockerd -H fd:// --containerd=/run/containerd/containerd.sock

修改为 ExecStart=/usr/bin/dockerd -H fd:// --containerd=/run/containerd/containerd.sock --exec-opt native.cgroupdriver=systemd

如果不修改，在添加 worker 节点时可能会碰到如下错误
[WARNING IsDockerSystemdCheck]: detected "cgroupfs" as the Docker cgroup driver. The recommended driver is "systemd". 
Please follow the guide at https://kubernetes.io/docs/setup/cri/


//使用如下命令修改  
sed -i.bak "s#^ExecStart=/usr/bin/dockerd.*#ExecStart=/usr/bin/dockerd -H fd:// --containerd=/run/containerd/containerd.sock --exec-opt native.cgroupdriver=systemd#g" /usr/lib/systemd/system/docker.service

//重启docker
systemctl daemon-reload && systemctl restart docker
```
## 安装Kubeadm
需要科学上网
```
cat >/etc/yum.repos.d/kubernetes.repo<<EOF
[kubernetes]
name=Kubernetes
baseurl=https://packages.cloud.google.com/yum/repos/kubernetes-el7-x86_64
enabled=1
gpgcheck=1
repo_gpgcheck=1
gpgkey=https://packages.cloud.google.com/yum/doc/yum-key.gpg
        https://packages.cloud.google.com/yum/doc/rpm-package-key.gpg
EOF
```
使用阿里云yum源
```
cat >/etc/yum.repos.d/kubernetes.repo <<EOF
[kubernetes]
name=Kubernetes
baseurl=http://mirrors.aliyun.com/kubernetes/yum/repos/kubernetes-el7-x86_64
enabled=1
gpgcheck=0
repo_gpgcheck=0
gpgkey=http://mirrors.aliyun.com/kubernetes/yum/doc/yum-key.gpg
        http://mirrors.aliyun.com/kubernetes/yum/doc/rpm-package-key.gpg
EOF
```
安装 kubeadm、kubelet、kubectl(阿里云yum源会随官方更新最新版，因此指定版本)
```
//安装1.16.9版本
yum -y install kubelet-1.16.9 kubeadm-1.16.9 kubectl-1.16.9

//查看版本
kubeadm version

kubeadm version: &version.Info{Major:"1", Minor:"16", GitVersion:"v1.16.9", GitCommit:"a17149e1a189050796ced469dbd78d380f2ed5ef", GitTreeState:"clean", BuildDate:"2020-04-16T11:42:30Z", GoVersion:"go1.13.9", Compiler:"gc", Platform:"linux/amd64"}
```
设置kubelet开机自启
```
systemctl enable kubelet
```
设置k8s命令自动补全
```
yum -y install bash-completion
source /usr/share/bash-completion/bash_completion
source <(kubectl completion bash)
echo "source <(kubectl completion bash)" >> ~/.bashrc
```
# 初始化集群
## master节点操作，配置 kubeadm 初始化文件
```
cat <<EOF > ./kubeadm-config.yaml
apiVersion: kubeadm.k8s.io/v1beta2
kind: ClusterConfiguration
kubernetesVersion: v1.16.9	
imageRepository: registry.cn-hangzhou.aliyuncs.com/google_containers

#master地址
controlPlaneEndpoint: "192.168.9.10:6443"	
networking:
  serviceSubnet: "10.96.0.0/16"	

  #k8s容器组所在的网段
  podSubnet: "10.20.0.1/16"	
  dnsDomain: "cluster.local"
EOF
```
初始化master
```
#kubeadm init --config=kubeadm-config.yaml --upload-certs
完整输出结果
kubeadm init --config=kubeadm-config.yaml
[init] Using Kubernetes version: v1.16.9
[preflight] Running pre-flight checks
[preflight] Pulling images required for setting up a Kubernetes cluster
[preflight] This might take a minute or two, depending on the speed of your internet connection
[preflight] You can also perform this action in beforehand using 'kubeadm config images pull'
[kubelet-start] Writing kubelet environment file with flags to file "/var/lib/kubelet/kubeadm-flags.env"
[kubelet-start] Writing kubelet configuration to file "/var/lib/kubelet/config.yaml"
[kubelet-start] Activating the kubelet service
[certs] Using certificateDir folder "/etc/kubernetes/pki"
[certs] Generating "ca" certificate and key
[certs] Generating "apiserver" certificate and key
[certs] apiserver serving cert is signed for DNS names [k8s-master kubernetes kubernetes.default kubernetes.default.svc kubernetes.default.svc.cluster.local] and IPs [10.96.0.1 192.168.9.10 192.168.9.10]
[certs] Generating "apiserver-kubelet-client" certificate and key
[certs] Generating "front-proxy-ca" certificate and key
[certs] Generating "front-proxy-client" certificate and key
[certs] Generating "etcd/ca" certificate and key
[certs] Generating "etcd/server" certificate and key
[certs] etcd/server serving cert is signed for DNS names [k8s-master localhost] and IPs [192.168.9.10 127.0.0.1 ::1]
[certs] Generating "etcd/peer" certificate and key
[certs] etcd/peer serving cert is signed for DNS names [k8s-master localhost] and IPs [192.168.9.10 127.0.0.1 ::1]
[certs] Generating "etcd/healthcheck-client" certificate and key
[certs] Generating "apiserver-etcd-client" certificate and key
[certs] Generating "sa" key and public key
[kubeconfig] Using kubeconfig folder "/etc/kubernetes"
[kubeconfig] Writing "admin.conf" kubeconfig file
[kubeconfig] Writing "kubelet.conf" kubeconfig file
[kubeconfig] Writing "controller-manager.conf" kubeconfig file
[kubeconfig] Writing "scheduler.conf" kubeconfig file
[control-plane] Using manifest folder "/etc/kubernetes/manifests"
[control-plane] Creating static Pod manifest for "kube-apiserver"
[control-plane] Creating static Pod manifest for "kube-controller-manager"
[control-plane] Creating static Pod manifest for "kube-scheduler"
[etcd] Creating static Pod manifest for local etcd in "/etc/kubernetes/manifests"
[wait-control-plane] Waiting for the kubelet to boot up the control plane as static Pods from directory "/etc/kubernetes/manifests". This can take up to 4m0s
[apiclient] All control plane components are healthy after 16.501777 seconds
[upload-config] Storing the configuration used in ConfigMap "kubeadm-config" in the "kube-system" Namespace
[kubelet] Creating a ConfigMap "kubelet-config-1.16" in namespace kube-system with the configuration for the kubelets in the cluster
[upload-certs] Skipping phase. Please see --upload-certs
[mark-control-plane] Marking the node k8s-master as control-plane by adding the label "node-role.kubernetes.io/master=''"
[mark-control-plane] Marking the node k8s-master as control-plane by adding the taints [node-role.kubernetes.io/master:NoSchedule]
[bootstrap-token] Using token: px979r.mphk9ee5ya8fgy44
[bootstrap-token] Configuring bootstrap tokens, cluster-info ConfigMap, RBAC Roles
[bootstrap-token] configured RBAC rules to allow Node Bootstrap tokens to post CSRs in order for nodes to get long term certificate credentials
[bootstrap-token] configured RBAC rules to allow the csrapprover controller automatically approve CSRs from a Node Bootstrap Token
[bootstrap-token] configured RBAC rules to allow certificate rotation for all node client certificates in the cluster
[bootstrap-token] Creating the "cluster-info" ConfigMap in the "kube-public" namespace
[addons] Applied essential addon: CoreDNS
[addons] Applied essential addon: kube-proxy

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
拷贝 kubeconfig 文件
```
//这里的路径为/root
mkdir -p $HOME/.kube
cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
chown $(id -u):$(id -g) $HOME/.kube/config
```
## master添加节点
node1和node2相同操作  
将master节点上的$HOME/.kube/config 文件拷贝到node节点对应的文件中
```
1.创建目录，这里的路径为/root
mkdir -p $HOME/.kube 

2.把master节点上的config文件拷贝到node1和node2的$HOME/.kube
scp k8s-master1:~/.kube/config $HOME/.kube

3.修改权限
chown $(id -u):$(id -g) $HOME/.kube/config
```
将node1和node2加入到集群中  
这里需要用到2.2中初始化master最后生成的token和sha256值
```
#kubeadm join 192.168.9.10:6443 --token px979r.mphk9ee5ya8fgy44     --discovery-token-ca-cert-hash sha256:5e7c7cd1cc1f86c0761e54b9380de22968b6b221cb98939c14ab2942223f6f51 
  
输出结果  
[preflight] Running pre-flight checks
	[WARNING IsDockerSystemdCheck]: detected "cgroupfs" as the Docker cgroup driver. The recommended driver is "systemd". Please follow the guide at https://kubernetes.io/docs/setup/cri/
[preflight] Reading configuration from the cluster...
[preflight] FYI: You can look at this config file with 'kubectl -n kube-system get cm kubeadm-config -oyaml'
[kubelet-start] Downloading configuration for the kubelet from the "kubelet-config-1.16" ConfigMap in the kube-system namespace
[kubelet-start] Writing kubelet configuration to file "/var/lib/kubelet/config.yaml"
[kubelet-start] Writing kubelet environment file with flags to file "/var/lib/kubelet/kubeadm-flags.env"
[kubelet-start] Activating the kubelet service
[kubelet-start] Waiting for the kubelet to perform the TLS Bootstrap...

This node has joined the cluster:
* Certificate signing request was sent to apiserver and a response was received.
* The Kubelet was informed of the new secure connection details.

Run 'kubectl get nodes' on the control-plane to see this node join the cluster.
```
如果忘记了token和sha256值，可以在master节点使用如下命令查看
```
//查看token
#kubeadm token list
TOKEN                     TTL       EXPIRES                     USAGES                   DESCRIPTION   EXTRA GROUPS
px979r.mphk9ee5ya8fgy44   20h       2020-03-18T13:49:48+08:00   authentication,signing   <none>        system:bootstrappers:kubeadm:default-node-token
            
            
//查看sha256
#openssl x509 -pubkey -in /etc/kubernetes/pki/ca.crt | openssl rsa -pubin -outform der 2>/dev/null | openssl dgst -sha256 -hex | sed 's/^.* //'
5e7c7cd1cc1f86c0761e54b9380de22968b6b221cb98939c14ab2942223f6f51

//同时查看token和sha256
#kubeadm token create --print-join-command
kubeadm join 192.168.9.10:6443 --token 9b28zg.oyt0kvvpmtrem4bg     --discovery-token-ca-cert-hash sha256:5e7c7cd1cc1f86c0761e54b9380de22968b6b221cb98939c14ab2942223f6f51
```
master节点查看node，发现状态都是NotReady，因为还没有安装网络插件，这里我们安装calio官方插件文档
```
kubectl get nodes
NAME         STATUS     ROLES    AGE     VERSION
k8s-master   NotReady   master   19m     v1.16.9
k8s-node1    NotReady   <none>   4m10s   v1.16.9
k8s-node2    NotReady   <none>   4m3s    v1.16.9
```
## master节点安装网络插件calio
```
//下载文件
wget https://docs.projectcalico.org/v3.8/manifests/calico.yaml
  
将文件中的620行改为如下，因为在上边kubeadm-config.yaml配置文件中指定了容器组IP  620行
value: "10.20.0.1/16"
  

//修改完成后安装calico网络插件
kubectl apply -f calico.yaml

//安装完成后稍等一会查看pods状态
kubectl get pods -n kube-system

NAME                                      READY   STATUS    RESTARTS   AGE
calico-kube-controllers-dc6cb64cb-8sh59   1/1     Running   0          6m22s
calico-node-89s9k                         1/1     Running   0          6m22s
calico-node-dkt7w                         1/1     Running   0          6m22s
calico-node-tgg2h                         1/1     Running   0          6m22s
coredns-667f964f9b-7hrj9                  1/1     Running   0          33m
coredns-667f964f9b-8q7sh                  1/1     Running   0          33m
etcd-k8s-master                           1/1     Running   0          33m
kube-apiserver-k8s-master                 1/1     Running   0          32m
kube-controller-manager-k8s-master        1/1     Running   0          33m
kube-proxy-b2r5d                          1/1     Running   0          12m
kube-proxy-nd982                          1/1     Running   0          11m
kube-proxy-zh6cz                          1/1     Running   0          33m
kube-scheduler-k8s-master                 1/1     Running   0          32m


//查看node状态
[root@k8s-master ~]# kubectl get nodes 
NAME         STATUS   ROLES    AGE     VERSION
k8s-master   Ready    master   31m     v1.16.9
k8s-node1    Ready    <none>   9m46s   v1.16.9
k8s-node2    Ready    <none>   9m22s   v1.16.9
```
## 安装Dashboard(可选)
下载文件及修改内容

[这里查看dashboard对应的k8s版本](https://github.com/kubernetes/dashboard/releases)
```
//下载文件  v2.0.0-rc3是中文版本，beta8是英文版本
wget https://raw.githubusercontent.com/kubernetes/dashboard/v2.0.0-beta8/aio/deploy/recommended.yaml

wget https://raw.githubusercontent.com/kubernetes/dashboard/v2.0.0-rc3/aio/deploy/recommended.yaml  
  
//修改Service为NodePort类型
42行下增加一行
nodePort: 30001
  
44行下增加一行
type: NodePort
  

//原先内容
spec:
  ports:
    - port: 443
      targetPort: 8443
  selector:
    k8s-app: kubernetes-dashboard


//修改后内容
spec:
  ports:
    - port: 443
      targetPort: 8443
      nodePort: 30001   #增加，指定nodeport端口
  selector:
    k8s-app: kubernetes-dashboard
  type: NodePort		#增加，修改类型为nodeport
```
部署dashboard
```
kubectl apply -f recommended.yaml
```
查看dashboard的运行状态及外网访问端口
```
//查看dashboard运行状态
#kubectl get pods -n kubernetes-dashboard -l k8s-app=kubernetes-dashboard
NAME                                    READY   STATUS    RESTARTS   AGE
kubernetes-dashboard-5996555fd8-2ppc5   1/1     Running   0          8m16s

//查看dashboard外网访问端口，命名空间为kubernetes-dashboard
#kubectl get svc -n kubernetes-dashboard -l k8s-app=kubernetes-dashboard
kubectl get svc -n kubernetes-dashboard -l k8s-app=kubernetes-dashboard
NAME                   TYPE       CLUSTER-IP      EXTERNAL-IP   PORT(S)         AGE
kubernetes-dashboard   NodePort   10.96.142.172   <none>        443:30001/TCP   8m37s
```
通过上边的30001端口访问dashboard，注意是https
> k8s1.16.9这个版本中，使用的dashboard版本是2.0.0-beta8，只有火狐浏览器可以访问，其余浏览器都不能访问，会报错
```
您的连接不是私密连接
```
> 使用火狐浏览器访问，由于 dashboard 默认是自建的 https 证书，该证书是不受浏览器信任的，所以我们需要强制跳转就可以了

然后创建一个具有全局所有权限的用户来登录Dashboard
```
//编辑admin.yaml文件
cat > admin.yaml <<EOF
kind: ClusterRoleBinding
apiVersion: rbac.authorization.k8s.io/v1beta1
metadata:
  name: admin
  annotations:
    rbac.authorization.kubernetes.io/autoupdate: "true"
roleRef:
  kind: ClusterRole
  name: cluster-admin
  apiGroup: rbac.authorization.k8s.io
subjects:
- kind: ServiceAccount
  name: admin
  namespace: kube-system

---
apiVersion: v1
kind: ServiceAccount
metadata:
  name: admin
  namespace: kube-system
  labels:
    kubernetes.io/cluster-service: "true"
    addonmanager.kubernetes.io/mode: Reconcile
EOF

//直接创建
kubectl apply -f admin.yaml

//查看token
kubectl get secret -n kube-system|grep admin-token

admin-token-j7sfh                                kubernetes.io/service-account-token   3      23s


//获取base64解码后的字符串，注意需要用到上边命令查看到的token，会生成很长的一串字符串
kubectl get secret admin-token-j7sfh -o jsonpath={.data.token} -n kube-system |base64 -d

#直接用这条命令搞定
kubectl get secret `kubectl get secret -n kube-system|grep admin-token|awk '{print $1}'` -o jsonpath={.data.token} -n kube-system |base64 -d && echo
```

到此，使用kubeadm安装k8s 1.16.9完成！！！

# 参考
[在 Kubernetes集群中 安装 KubeSphere2.1](https://kubesphere.com.cn/forum/d/1272-kubeadm-k8s-kubesphere-2-1-1)