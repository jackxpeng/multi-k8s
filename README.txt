1. Install Envoy Gateway
helm install envoy-gateway oci://docker.io/envoyproxy/gateway-helm \
  -n envoy-gateway-system --create-namespace
2. Make Envoy public (so Windows can reach it)
helm upgrade envoy-gateway oci://docker.io/envoyproxy/gateway-helm \
  -n envoy-gateway-system --set service.type=LoadBalancer


That’s all the Helm part — it installs the controller, CRDs, and data-plane.