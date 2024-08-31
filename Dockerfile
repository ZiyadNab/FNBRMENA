# Use the latest Node.js image
FROM node:latest

# Set the working directory
WORKDIR ./App

# Copy package.json and package-lock.json files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your application code
COPY . .

# Command to run the application
CMD ["node", "index.js"]
