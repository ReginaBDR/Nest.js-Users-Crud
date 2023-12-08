# Use the official Node.js image as the base image
FROM node:18

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the entire project to the working directory
COPY . .

# Copy the .env and .env.development files
# COPY .env .env.development ./

# Creates a "dist" folder with the production build
# RUN npm run build

# Expose the port on which the application will run
EXPOSE 3000

# Command to run the application
CMD ["npm", "run", "start:dev"]
