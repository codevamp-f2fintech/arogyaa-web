# Use the official Node.js image as a base
FROM node:18

# Set the working directory
WORKDIR /app

# Copy only package.json and package-lock.json initially to leverage Docker's cache
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose port 3000
EXPOSE 3000

# Start the Next.js application in development mode
CMD ["npm", "run", "dev"]
