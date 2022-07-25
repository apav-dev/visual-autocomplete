import {
  provideAnswersHeadless,
  VerticalResults as VerticalResultsData,
} from "@yext/answers-headless-react";
import {
  DropdownItem,
  FocusedItemData,
  RenderEntityPreviews,
  SearchBar,
  UniversalResults,
} from "@yext/answers-react-components";
import { Product } from "./types/products";
import classnames from "classnames";

function App() {
  const entityPreviewSearcher = provideAnswersHeadless({
    apiKey: "e9755fac637e4e08de5ebf61be5f1a5e",
    experienceKey: "yext-fashion-warehouse",
    locale: "en",
    headlessId: "entity-preview-searcher",
  });

  const renderProductPreview = (product: Product): JSX.Element => {
    const numThumbnails =
      product.photoGallery?.[0].image.thumbnails?.length ?? 0;
    const previewImage = numThumbnails
      ? product.photoGallery?.[0].image.thumbnails?.[numThumbnails - 1].url
      : undefined;

    return (
      <div className="flex flex-col items-center cursor-pointer hover:bg-gray-100 ">
        {numThumbnails && <img src={previewImage} className=" w-32 " />}
        <div className="font-semibold pl-3">{product.name}</div>
      </div>
    );
  };

  const renderEntityPreviews: RenderEntityPreviews = (
    autocompleteLoading: boolean,
    verticalKeyToResults: Record<string, VerticalResultsData>,
    onSubmit: (value: string, _index: number, itemData: FocusedItemData) => void
  ): JSX.Element | null => {
    const productResults = verticalKeyToResults["products"];
    return productResults ? (
      <div
        // laying out the product previews in a grid
        className={classnames("grid grid-cols-4 px-8", {
          //
          "opacity-50": autocompleteLoading,
        })}
      >
        {productResults.results.map((result, i) => (
          <DropdownItem
            className=""
            value={result.name ?? i.toString()}
            onClick={() => history.pushState(null, "", `/product/${result.id}`)}
          >
            {renderProductPreview(result.rawData as unknown as Product)}
          </DropdownItem>
        ))}
      </div>
    ) : null;
  };

  return (
    <div className="flex justify-center px-4 py-6">
      <div className="w-full max-w-5xl">
        <SearchBar
          hideVerticalLinks
          hideRecentSearches
          visualAutocompleteConfig={{
            entityPreviewSearcher: entityPreviewSearcher,
            restrictVerticals: ["products"],
            renderEntityPreviews: renderEntityPreviews,
            universalLimit: { products: 4 },
            entityPreviewsDebouncingTime: 100,
          }}
        />
        <UniversalResults
          verticalConfigMap={{
            faqs: {},
            locations: {},
            products: {},
          }}
        />
      </div>
    </div>
  );
}

export default App;
