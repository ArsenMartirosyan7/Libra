FROM ubuntu:latest

# Install any necessary tools for configuring the firewall
RUN apt-get update && apt-get install -y iptables

# Create a directory for storing the firewall configuration script
RUN mkdir -p /usr/local/bin/nginx

# Copy the firewall configuration script into the image
COPY ./nginx/configure_firewall.sh /usr/local/bin/nginx/

# Set the script as executable
RUN chmod +x /usr/local/bin/nginx/configure_firewall.sh

# Define the entry point to execute the firewall configuration script
ENTRYPOINT ["/usr/local/bin/nginx/configure_firewall.sh"]