#!/bin/bash

# Clear existing firewall rules
iptables -F

# Allow all incoming traffic
iptables -P INPUT ACCEPT

# Allow all outgoing traffic
iptables -P OUTPUT ACCEPT

# Allow all traffic on loopback interface
iptables -A INPUT -i lo -j ACCEPT
iptables -A OUTPUT -o lo -j ACCEPT

# Save the firewall rules
iptables-save > /etc/iptables/rules.v4

# Display the current firewall rules
iptables -L