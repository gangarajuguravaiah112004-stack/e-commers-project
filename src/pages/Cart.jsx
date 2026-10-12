import { ArrowLeft, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

const Cart = () => {
  const {
    items,
    isLoading,
    error,
    itemCount,
    subtotal,
    updateQuantity,
    removeFromCart,
  } = useCart();

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 text-slate-900 sm:px-6 lg:px-8">
      <section className="mx-auto max-w-6xl">
        <Link
          to="/dashboard"
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition-colors hover:text-orange-600"
        >
          <ArrowLeft size={17} />
          Continue shopping
        </Link>

        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-orange-600">
            Your selection
          </p>
          <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
            Shopping cart
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            {itemCount} {itemCount === 1 ? "item" : "items"} in your cart
          </p>
        </div>

        {isLoading ? (
          <p className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-500 shadow-sm">
            Loading your cart...
          </p>
        ) : error && items.length === 0 ? (
          <p role="alert" className="rounded-2xl bg-red-50 p-6 text-center text-red-700">
            {error}
          </p>
        ) : items.length === 0 ? (
          <div className="rounded-3xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm">
            <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-50 text-orange-500">
              <ShoppingBag size={30} />
            </span>
            <h2 className="mt-5 text-xl font-bold">Your cart is empty</h2>
            <p className="mt-2 text-sm text-slate-500">
              Find something you love and it will show up here.
            </p>
            <Link
              to="/dashboard"
              className="mt-6 inline-flex rounded-xl bg-orange-500 px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-orange-600"
            >
              Explore products
            </Link>
          </div>
        ) : (
          <div className="grid items-start gap-6 lg:grid-cols-[1fr_340px]">
            {error && (
              <p
                role="alert"
                className="rounded-xl bg-red-50 p-4 text-sm text-red-700 lg:col-span-2"
              >
                {error}
              </p>
            )}
            <div className="space-y-3">
              {items.map((item) => (
                <article
                  key={item.id}
                  className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center"
                >
                  <div className="flex h-24 w-full shrink-0 items-center justify-center rounded-xl bg-slate-50 p-2 sm:w-24">
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      className="h-full w-full object-contain"
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <h2 className="truncate font-semibold text-slate-900">
                      {item.title}
                    </h2>
                    <p className="mt-1 text-sm font-bold text-orange-600">
                      ${item.price.toFixed(2)}
                    </p>
                  </div>

                  <div className="flex items-center justify-between gap-4 sm:justify-end">
                    <div className="flex items-center rounded-lg border border-slate-200">
                      <button
                        type="button"
                        aria-label={`Decrease quantity of ${item.title}`}
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                        className="flex h-9 w-9 items-center justify-center text-slate-600 transition-colors hover:text-orange-600"
                      >
                        <Minus size={15} />
                      </button>
                      <span
                        aria-label="Quantity"
                        className="min-w-8 text-center text-sm font-semibold"
                      >
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        aria-label={`Increase quantity of ${item.title}`}
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                        className="flex h-9 w-9 items-center justify-center text-slate-600 transition-colors hover:text-orange-600"
                      >
                        <Plus size={15} />
                      </button>
                    </div>

                    <p className="w-20 text-right text-sm font-bold">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>

                    <button
                      type="button"
                      aria-label={`Remove ${item.title} from cart`}
                      onClick={() => removeFromCart(item.id)}
                      className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 size={17} />
                    </button>
                  </div>
                </article>
              ))}
            </div>
            <aside className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-lg font-bold">Order summary</h2>
              <div className="mt-5 flex justify-between text-sm text-slate-600">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <p className="mt-2 text-xs leading-5 text-slate-500">
                Shipping and taxes are calculated at checkout.
              </p>
              <div className="my-5 h-px bg-slate-100" />
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <p className="mt-4 text-xs text-slate-500">
                Checkout is not available yet. Your cart will be saved on this
                device.
              </p>
            </aside>
          </div>
        )}
      </section>
    </main>
  );
};

export default Cart;
