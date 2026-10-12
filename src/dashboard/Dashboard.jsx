import axios from 'axios'

import { useEffect, useState } from 'react'
import { useCart } from '../context/CartContext'

const Dashboard = () => {
  const { addToCart } = useCart()
  const [products, setProducts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [favorites, setFavorites] = useState({})

  const toggleFavorite = (productId) => {
    setFavorites((currentFavorits)=>({
      ...currentFavorits,
      [productId]:!currentFavorits[productId]
    }))
  }  
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get('https://dummyjson.com/products')
        setProducts(data.products)
      } catch (requestError) {
        setError(
          requestError.response?.data?.message ||
            requestError.message ||
            'Unable to load products. Please try again.'
        )
      } finally {
        setIsLoading(false)
      }
    }

    fetchProducts()
  }, [])

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6 lg:px-8">
      <section className="mx-auto max-w-screen-2xl">
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-indigo-600">
              Product collection
            </p>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Find your next favorite
            </h1>
            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500 sm:text-base">
              Explore our handpicked products, with something for every day.
            </p>
          </div>
          {!isLoading && !error && (
            <div className="flex flex-wrap gap-2">
              <span className="w-fit rounded-full bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow-sm ring-1 ring-slate-200">
                {products.length} products
              </span>
            </div>
          )}
        </div>

        {isLoading && (
          <p className="rounded-2xl bg-white p-8 text-center text-slate-500 shadow-sm">
            Loading products...
          </p>
        )}

        {!isLoading && error && (
          <p role="alert" className="rounded-2xl bg-red-50 p-6 text-center text-red-700">
            {error}
          </p>
        )}

        {!isLoading && !error && (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {products.map((product) => (
              <article
                key={product.id}
                className="group flex h-full flex-col overflow-hidden rounded-lg bg-white shadow-sm ring-1 ring-slate-200 transition duration-200 hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="relative flex h-24 items-center justify-center bg-slate-100 p-2 sm:h-28">
                  <img
                    src={product.thumbnail}
                    alt={product.title}
                    className="h-full w-full object-contain transition duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                  {product.discountPercentage > 0 && (
                    <span className="absolute left-2 top-2 rounded-full bg-indigo-600 px-2 py-1 text-[10px] font-semibold text-white sm:text-xs">
                      {Math.round(product.discountPercentage)}% off
                    </span>
                  )}
                  <button
                    type="button"
                    aria-label={`Toggle ${product.title} wishlist`}
                    className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-lg text-rose-500 shadow-sm transition hover:bg-white"
                    onClick={() => toggleFavorite(product.id)}
                  >
                    {favorites[product.id]? '❤️' : '♡'}
                  </button>
                </div>

                <div className="flex flex-1 flex-col p-2.5">
                  <p className="mb-1 truncate text-[10px] font-semibold uppercase tracking-wider text-indigo-600">
                    {product.category}
                  </p>
                  <h2 className="line-clamp-1 text-sm font-semibold text-slate-900">
                    {product.title}
                  </h2>
                  <p className="mt-1 line-clamp-1 text-xs leading-5 text-slate-500">
                    {product.description}
                  </p>

                  <div className="mt-2 flex items-center justify-between gap-1">
                    <span className="text-xs font-medium text-amber-500">
                      ★ {product.rating}
                    </span>
                    <span className="truncate text-[10px] text-slate-400">
                      {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                    </span>
                  </div>

                  <div className="mt-2 flex items-baseline gap-1 border-t border-slate-100 pt-2">
                    <span className="text-lg font-bold text-slate-900">
                      ${product.price}
                    </span>
                    {product.discountPercentage > 0 && (
                      <span className="text-xs text-slate-400 line-through">
                        $
                        {(
                          product.price /
                          (1 - product.discountPercentage / 100)
                        ).toFixed(2)}
                      </span>
                    )}
                  </div>

                  <div className="mt-3 grid grid-cols-2 gap-1.5">
                    <button
                      type="button"
                      className="rounded-md bg-indigo-600 px-2 py-1.5 text-[11px] font-semibold text-white sm:text-xs"
                      onClick={() => addToCart(product)}
                    >
                      Add to cart
                    </button>
                    <button
                      type="button"
                      className="rounded-md border border-indigo-200 px-2 py-1.5 text-[11px] font-semibold text-indigo-700 sm:text-xs"
                    >
                      Buy now
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}

export default Dashboard
