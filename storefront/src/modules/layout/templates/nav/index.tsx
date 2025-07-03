import { retrieveCart } from "@/lib/data/cart"
import { retrieveCustomer } from "@/lib/data/customer"
import AccountButton from "@/modules/account/components/account-button"
import CartButton from "@/modules/cart/components/cart-button"
import LocalizedClientLink from "@/modules/common/components/localized-client-link"
import FilePlus from "@/modules/common/icons/file-plus"
import LogoIcon from "@/modules/common/icons/logo"
import { MegaMenuWrapper } from "@/modules/layout/components/mega-menu"
import { RequestQuoteConfirmation } from "@/modules/quotes/components/request-quote-confirmation"
import { RequestQuotePrompt } from "@/modules/quotes/components/request-quote-prompt"
import SkeletonAccountButton from "@/modules/skeletons/components/skeleton-account-button"
import SkeletonCartButton from "@/modules/skeletons/components/skeleton-cart-button"
import SkeletonMegaMenu from "@/modules/skeletons/components/skeleton-mega-menu"
import { Suspense } from "react"

export async function NavigationHeader() {
  const customer = await retrieveCustomer().catch(() => null)
  const cart = await retrieveCart()

  return (
    <div className="sticky top-0 inset-x-0 group bg-gray-900 text-white small:p-4 p-2 text-sm border-b border-gray-800 duration-200 z-50">
      <header className="flex w-full content-container relative small:mx-auto justify-between">
        <div className="small:mx-auto flex justify-between items-center min-w-full">
          <div className="flex items-center small:space-x-4">
            <LocalizedClientLink
              className="hover:text-blue-400 flex items-center w-fit"
              href="/"
            >
              <h1 className="small:text-base text-sm font-medium flex items-center">
                <LogoIcon className="inline mr-2" />
                Blade box
              </h1>
            </LocalizedClientLink>

            <nav>
              <ul className="space-x-4 hidden small:flex">
                <li>
                  <Suspense fallback={<SkeletonMegaMenu />}>
                    <MegaMenuWrapper />
                  </Suspense>
                </li>
              </ul>
            </nav>
          </div>
          <div className="flex justify-end items-center gap-2">
            <div className="relative mr-2 hidden small:inline-flex">
              <input
                disabled
                type="text"
                placeholder="Search for products"
                className="bg-gray-800 text-white px-4 py-2 rounded-full pr-10 shadow-borders-base hidden small:inline-block hover:cursor-not-allowed border border-gray-700 placeholder-gray-400"
                title="Install a search provider to enable product search"
              />
            </div>

            <div className="h-4 w-px bg-gray-700" />

            {customer && cart?.items && cart.items.length > 0 ? (
              <RequestQuoteConfirmation>
                <button
                  className="flex gap-1.5 items-center rounded-2xl bg-none shadow-none border-none hover:bg-gray-800 px-2 py-1 text-white"
                  // disabled={isPendingApproval}
                >
                  <FilePlus />
                  <span className="hidden small:inline-block">Quote</span>
                </button>
              </RequestQuoteConfirmation>
            ) : (
              <RequestQuotePrompt>
                <button className="flex gap-1.5 items-center rounded-2xl bg-none shadow-none border-none hover:bg-gray-800 px-2 py-1 text-white">
                  <FilePlus />
                  <span className="hidden small:inline-block">Quote</span>
                </button>
              </RequestQuotePrompt>
            )}

            <Suspense fallback={<SkeletonAccountButton />}>
              <AccountButton customer={customer} />
            </Suspense>

            <Suspense fallback={<SkeletonCartButton />}>
              <CartButton />
            </Suspense>
          </div>
        </div>
      </header>
    </div>
  )
}
