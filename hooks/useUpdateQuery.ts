"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useCallback } from "react";

export const useUpdateQuery = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const updateQuery = useCallback(
    (name: string, value: string | number | boolean) => {
      // 1. Copy lại các query hiện có trên URL
      const params = new URLSearchParams(searchParams.toString());

      // 2. Nếu có giá trị thì set, không có (chuỗi rỗng/null) thì xóa luôn cho sạch URL
      if (value) {
        params.set(name, String(value));
      } else {
        params.delete(name);
      }

      // 3. Đẩy lên thanh địa chỉ trình duyệt
      const query = params.toString();
      const result = query ? `?${query}` : "";

      router.push(`${pathname}${result}`, { scroll: false });
    },
    [searchParams, pathname, router]
  );

  return { updateQuery, searchParams };
};
