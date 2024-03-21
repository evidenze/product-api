# Product Management API

Product management API.

## Installation

1. Clone the repository:

```
git clone https://github.com/evidenze/product-api.git
```

2. Navigate into the project directory:

```
cd product-api
```

3. Install dependencies:

```
npm install
```

4. Copy the `.env.example` file to `.env`:

```
cp .env.example .env
```

5. Configure your database connection in the `.env` file:

```
DB_URL=mongodb://admin:adminpassword@localhost:27017/product
```

## Starting the Server

Start the development server:

```
npm run dev
```

The API will be available at `http://localhost:3000`.

## Running Tests

Run tests to ensure everything is working correctly: 

```
npm run test
```

## API Endpoints

### Create a Product

- **URL:** `/api/products`
- **Method:** POST
- **Request Body:**
  ```json
  {
      "name": "Product Name",
      "price": 10.99,
      "description": "Product Description",
      "category": "Product Category",
      "imageUrl": "Product Image URL",
      "quantity": 10
  }
  ```
- **Response:**
  ```json
  {
    "status": true,
    "message": "Product created successfully",
    "data": {
      "_id": "product_id",
      "name": "Product Name",
      "price": 10.99,
      "description": "Product Description",
      "category": "Product Category",
      "imageUrl": "Product Image URL",
      "quantity": 10
    }
  }
  ```

### Get Product by ID

- **URL:** `/api/products/:id`
- **Method:** GET
- **Response:**
  ```json
  {
    "status": true,
    "message": "Product fetched successfully",
    "data": {
      "_id": "product_id",
      "name": "Product Name",
      "price": 10.99,
      "description": "Product Description",
      "category": "Product Category",
      "imageUrl": "Product Image URL",
      "quantity": 10
    }
  }
  ```

### Update Product

- **URL:** `/api/products/:id`
- **Method:** PUT
- **Request Body:**
  ```json
  {
      "name": "Updated Product Name",
      "price": 20.99,
      "description": "Updated Product Description",
      "category": "Updated Product Category",
      "imageUrl": "Updated Product Image URL",
      "quantity": 20
  }
  ```
- **Response:**
  ```json
  {
    "status": true,
    "message": "Product updated successfully",
    "data": {
      "_id": "product_id",
      "name": "Updated Product Name",
      "price": 20.99,
      "description": "Updated Product Description",
      "category": "Updated Product Category",
      "imageUrl": "Updated Product Image URL",
      "quantity": 20
    }
  }
  ```

### Delete Product

- **URL:** `/api/products/:id`
- **Method:** DELETE
- **Response:**
  ```json
  {
    "status": true,
    "message": "Product deleted successfully"
  }
  ```