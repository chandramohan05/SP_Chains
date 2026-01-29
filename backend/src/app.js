import express from 'express'
import cors from 'cors'

// ROUTES
import authRoutes from './routes/auth.routes.js'
import dealerRoutes from './routes/delear.routes.js'
import adminRoutes from './routes/admin.routes.js'
import productRoutes from './routes/product.routes.js'
import cartRoutes from './routes/cart.routes.js'
import orderRoutes from './routes/order.routes.js'
import bannerRoutes from './routes/banner.routes.js'
import couponRoutes from './routes/coupon.routes.js'
import notificationRoutes from './routes/notification.routes.js'
import pricingRoutes from './routes/pricing.routes.js' // ✅ ADD THIS
import supportRoutes from './routes/support.routes.js'


// CREATE APP
const app = express()

// GLOBAL MIDDLEWARES
//import cors from 'cors'

app.use(cors({
  origin: 'http://192.168.1.36:5174', // your Vite frontend
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))

app.use(express.json())

// HEALTH CHECK
app.get('/', (req, res) => {
  res.json({ status: 'OK', message: 'SP Chains API running' })
})

// ================= PUBLIC / AUTH =================
app.use('/api/auth', authRoutes)
app.use('/api/dealers', dealerRoutes)
app.use('/api/products', productRoutes)
app.use('/api/cart', cartRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/banners', bannerRoutes)
app.use('/api/coupons', couponRoutes)
//app.use('/api/admin', supportRoutes)
app.use('/', supportRoutes)


// ================= ADMIN =================
app.use('/api/admin', adminRoutes)
app.use('/api/admin/pricing', pricingRoutes)
app.use('/api/admin/notifications', notificationRoutes)

export default app
