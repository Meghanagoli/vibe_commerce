# 🛒 Vibe Commerce — Mock E-Com Cart

**Assignment:** Full Stack Coding Assignment — Mock E-Com Cart  

A simple full-stack shopping cart app built for Vibe Commerce screening.  
Implements basic e-commerce flows: browse products, add/remove/update cart items, calculate totals, and a mock checkout that returns a receipt (no real payments).

---

## 🔧 Tech stack
- **Frontend:** React (Vite) + TailwindCSS
- **Backend:** Node.js + Express
- **Database:** MongoDB 
- **API:** REST

---

## ✨ Features implemented
**Backend**
- `GET /api/products` — returns 20 mock products .
- `POST /api/cart` — adds `{ productId, qty }` into cart.
- `DELETE /api/cart/:id` — remove cart item by id.
- `GET /api/cart` — returns cart items + total.
- `POST /api/checkout` — accepts `{ cartItems, name, email }` → returns mock receipt `{ total, timestamp, items }`.
-  DB persistence with MongoDB (cart saved per mock user).
-  Basic error handling and validations.
-  Usage of Fake Store API

**Frontend**
- Products grid (3 per row on desktop) with card UI.
- Add to Cart button on each product.
- Cart view: list, update quantity, remove item, shows total.
- Checkout form (name, email) → displays receipt modal.
- Responsive design (mobile/tablet/desktop).
  
---

## 🚀 Quick start (local)

### Pre-reqs
- Node.js (16+)
- npm / yarn
- MongoDB running locally or provide `MONGO_URI`

### Clone
```bash
git clone https://github.com/Meghanagoli/vibe_commerce.git
cd vibe_commerce
```
### Setup Backend
``` bash
cd backend
npm install
```
### Create a .env file:
``` bash
MONGO_URI=YOUR_MONGO_URI
PORT=5000
MOCK_USER_EMAIL=test@vibe.com
MOCK_USER_NAME=Test User
USE_FAKESTORE=true
FAKESTORE_URL=https://fakestoreapi.com/products

```
### Start Backend:
``` bash
nodemon server.js
```
Backend runs at: http://localhost:5000
### Setup Frontend :
``` bash
cd frontend
npm i
```
### Start Frontend:
``` bash
npx vite
```
Frontend runs at: http://localhost:5173
## Screenshots
**Products page**
<img width="1919" height="965" alt="image" src="https://github.com/user-attachments/assets/ff58fcc5-c3c9-47c0-a2d8-4708fe213742" />

**Cart page**
  <img width="1915" height="967" alt="image" src="https://github.com/user-attachments/assets/d896467f-e37a-4d0f-b5e8-3c5f7389fb05" />
  
**Checkout Page**
<img width="1914" height="866" alt="Screenshot 2025-10-29 134449" src="https://github.com/user-attachments/assets/e3bf77fe-e5cb-45b0-858f-0d419ae8d08a" />
**Receipt**
 <img width="1183" height="775" alt="Screenshot 2025-10-29 134516" src="https://github.com/user-attachments/assets/d4ccf0b1-adf4-40bf-8725-6e7c05c2a6b5" />

## Loom Video link
https://www.loom.com/share/c74b5b893c794747b7db5ccdfedb4839
## Frontend live url
https://frontend-three-theta-75.vercel.app
## Backend live url
https://vibe-commerce-0vj6.onrender.com/api/products

https://vibe-commerce-0vj6.onrender.com/api/cart
