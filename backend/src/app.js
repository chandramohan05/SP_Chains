import express from 'express'
import cors from 'cors'

// ROUTES
import authRoutes from './routes/auth.routes.js'
import dealerRoutes from './routes/delear.routes.js' // ✅ FIXED
import adminRoutes from './routes/admin.routes.js'
import productRoutes from './routes/product.routes.js'
import cartRoutes from './routes/cart.routes.js'
import orderRoutes from './routes/order.routes.js'
import bannerRoutes from './routes/banner.routes.js'
import couponRoutes from './routes/coupon.routes.js'




// ✅ CREATE APP FIRST
const app = express()

// ✅ GLOBAL MIDDLEWARES
app.use(cors())
app.use(express.json())

// ✅ HEALTH CHECK
app.get('/', (req, res) => {
  res.json({ status: 'OK', message: 'SP Chains API running' })
})

// ✅ ROUTES
app.use('/api/auth', authRoutes)
app.use('/api/dealers', dealerRoutes)
app.use('/api/products', productRoutes)
app.use('/api/cart', cartRoutes)
app.use('/api/orders', orderRoutes)

/* ✅ BANNERS (NO AUTH – DEMO MODE) */
app.use('/api/banners', bannerRoutes)
app.use('/api/coupons', couponRoutes)



// ✅ EXPORT
export default app
