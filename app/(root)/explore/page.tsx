import React, { Suspense } from "react";
import ExplorePage from "./ExplorePageClient";

const Page = () => {
  return (
    <Suspense fallback={<div className="p-4">Loading Explore...</div>}>
      <ExplorePage />
    </Suspense>
  );
};

export default Page;
