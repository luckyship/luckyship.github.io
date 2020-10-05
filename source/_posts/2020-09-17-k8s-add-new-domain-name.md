---
layout: post
title: "kubernetes集群中访问外部域名"
date: 2020-09-17
excerpt: "在k8s集群中，在pod内需要访问外部域名，或者dns无法解析的域名"
tags: [kubernetes]
comments: true
---

一般来说有三种方法可以实现添加外部域名
* 通过hostalias在deployment里面修改hosts文件
* 通过coredns修改hosts文件
* 通过coredns添加域名服务器
## 通过hostalias添加域名和ip
创建nginx pod
```
kubectl run nginx --image nginx
pod/nginx created
```
查看pod
```
$ kubectl get pods --output=wide
NAME     READY     STATUS    RESTARTS   AGE    IP           NODE
nginx    1/1       Running   0          13s    10.200.0.4   worker0

$ kubectl exec nginx -- cat /etc/hosts
127.0.0.1	localhost
::1	localhost ip6-localhost ip6-loopback
fe00::0	ip6-localnet
fe00::0	ip6-mcastprefix
fe00::1	ip6-allnodes
fe00::2	ip6-allrouters
10.200.0.4	nginx
```
添加额外的域名和ip
```
apiVersion: v1
kind: Pod
metadata:
  name: hostaliases-pod
spec:
  restartPolicy: Never
  hostAliases:
  - ip: "127.0.0.1"
    hostnames:
    - "foo.local"
    - "bar.local"
  - ip: "10.1.2.3"
    hostnames:
    - "foo.remote"
    - "bar.remote"
  containers:
  - name: cat-hosts
    image: busybox
    command:
    - cat
    args:
    - "/etc/hosts"
```
运行这个pod
```
kubectl apply -f https://k8s.io/examples/service/networking/hostaliases-pod.yaml
pod/hostaliases-pod created
```
它的hostfile
```
$ kubectl exec hostaliases-pod -- cat /etc/hosts
127.0.0.1	localhost
::1	localhost ip6-localhost ip6-loopback
fe00::0	ip6-localnet
fe00::0	ip6-mcastprefix
fe00::1	ip6-allnodes
fe00::2	ip6-allrouters
10.200.0.5	hostaliases-pod

# Entries added by HostAliases.
127.0.0.1	foo.local	bar.local
10.1.2.3	foo.remote	bar.remote
```

## 通过coredns修改hosts文件
使用edit命令修改coredns configmap资源, 添加域名`193.160.57.121 harbor.com`
```
kubectl edit configmap coredns -n kube-system
```
```
[root@node-2 test]# kubectl get configmap coredns -n kube-system -o yaml
apiVersion: v1
data:
  Corefile: |
    .:53 {
        errors
        health
        ready
        kubernetes cluster.local. in-addr.arpa ip6.arpa {
            pods insecure
            fallthrough in-addr.arpa ip6.arpa
            ttl 30
        }
        hosts {
           193.160.57.121 harbor.com
           fallthrough
        }
        prometheus :9153
        forward . /etc/resolv.conf
        cache 30
        loop
        reload
        loadbalance
    }
kind: ConfigMap
metadata:
  creationTimestamp: "2020-08-20T10:18:50Z"
  labels:
    addonmanager.kubernetes.io/mode: EnsureExists
  name: coredns
  namespace: kube-system
  resourceVersion: "13875493"
  selfLink: /api/v1/namespaces/kube-system/configmaps/coredns
  uid: 10a8e6df-d3d6-49a6-98b9-57640fdb6011
```
## 通过coredns添加域名服务器

使用edit命令修改coredns configmap资源，添加 `proxy . xxx.xxx.xxx.xxx`
```
apiVersion: v1
data:
  Corefile: |
    .:53 {
        errors
        health
        ready
        kubernetes cluster.local. in-addr.arpa ip6.arpa {
            pods insecure
            fallthrough in-addr.arpa ip6.arpa
            ttl 30
        }
        proxy . 10.167.129.6
        prometheus :9153
        forward . /etc/resolv.conf
        cache 30
        loop
        reload
        loadbalance
    }
kind: ConfigMap
metadata:
  creationTimestamp: "2020-08-20T10:18:50Z"
  labels:
    addonmanager.kubernetes.io/mode: EnsureExists
  name: coredns
  namespace: kube-system
  resourceVersion: "13875493"
  selfLink: /api/v1/namespaces/kube-system/configmaps/coredns
  uid: 10a8e6df-d3d6-49a6-98b9-57640fdb6011

```