import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      unique: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
        },
        name: String,
        sku: String,
        price: Number,
        quantity: Number,
        size: String,
        color: String,
        image: String,
      },
    ],
    total: {
      type: Number,
      required: true,
    },
    subtotal: Number,
    shippingFee: {
      type: Number,
      default: 200,
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'packed', 'shipped', 'delivered', 'cancelled'],
      default: 'pending',
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'pending',
    },
    paymentIntentId: String,
    shippingAddress: {
      name: String,
      phone: String,
      street: String,
      city: String,
      province: String,
      postalCode: String,
      country: { type: String, default: 'Pakistan' },
    },
    statusHistory: [
      {
        status: String,
        timestamp: { type: Date, default: Date.now },
        note: String,
      },
    ],
    notes: String,
  },
  { timestamps: true }
);

// Auto-generate order ID before saving
orderSchema.pre('save', async function (next) {
  if (!this.orderId) {
    const date = new Date();
    const dateStr =
      date.getFullYear().toString() +
      String(date.getMonth() + 1).padStart(2, '0') +
      String(date.getDate()).padStart(2, '0');
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    this.orderId = `ORD-${dateStr}-${randomSuffix}`;
  }
  next();
});

const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);
export default Order;
