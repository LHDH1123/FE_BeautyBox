export function createCategorySelect(categories, parentId = "", level = 0) {
  const options = [];

  categories.forEach((category) => {
    // Nếu category là con của parentId
    if (category.parent_id === parentId) {
      const paddingLeft = level * 20; // Mỗi cấp sẽ thụt vào thêm 20px

      options.push(
        <option
          key={category._id}
          value={category._id}
          style={{ paddingLeft: `${paddingLeft}px` }}
        >
          {`${"-- ".repeat(level)}${category.title}`}
        </option>
      );

      // Tạo các tùy chọn cho danh mục con (đệ quy)
      options.push(
        ...createCategorySelect(categories, category._id, level + 1)
      );
    }
  });

  return options;
}
