1. Install Envoy Gateway
helm install envoy-gateway oci://docker.io/envoyproxy/gateway-helm \
  -n envoy-gateway-system --create-namespace
2. Make Envoy public (so Windows can reach it)
helm upgrade envoy-gateway oci://docker.io/envoyproxy/gateway-helm \
  -n envoy-gateway-system --set service.type=LoadBalancer


That’s all the Helm part — it installs the controller, CRDs, and data-plane.


MetalLB (instead of minikube tunnel)

1) Make sure the MetalLB chart finished and the webhook is up
# Reinstall/upgrade and WAIT for readiness (important)
helm repo add metallb https://metallb.github.io/metallb
helm repo update
helm upgrade --install metallb metallb/metallb \
  -n metallb-system --create-namespace --wait

2) Verify the components
kubectl -n metallb-system get deploy,po,svc,job
kubectl get crd | grep metallb
kubectl -n metallb-system get endpoints metallb-webhook-service

3) Now apply your pool + advertisement
SUBNET=$(minikube ip | awk -F. '{print $1"."$2"."$3}')
cat <<EOF | kubectl apply -f -
apiVersion: metallb.io/v1beta1
kind: IPAddressPool
metadata:
  name: mk-pool
  namespace: metallb-system
spec:
  addresses:
  - ${SUBNET}.100-${SUBNET}.120
---
apiVersion: metallb.io/v1beta1
kind: L2Advertisement
metadata:
  name: mk-adv
  namespace: metallb-system
spec:
  ipAddressPools:
  - mk-pool
EOF

4) Add manual host routes

route add 172.19.52.100 mask 255.255.255.255 172.19.52.253
    -p for permanent route
