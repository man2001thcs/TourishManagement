FROM nginx:alpine

# Copy the built Angular app from the build stage
COPY --from=build /dist/roxanne /usr/share/nginx/html

# Copy the Nginx configuration file
COPY nginx.conf /etc/nginx/nginx.conf

# Expose port 80
EXPOSE 80

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]