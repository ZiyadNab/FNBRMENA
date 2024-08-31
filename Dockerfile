# Use the latest Node.js image
FROM node:latest

# Set the working directory
WORKDIR /App

# Copy package.json and package-lock.json files from the App directory
COPY App/package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your application code from the App directory
COPY App ./

# Command to run the application
CMD ["node", "index.js"]
