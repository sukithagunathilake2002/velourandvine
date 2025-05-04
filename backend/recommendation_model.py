def generate_recommendations(past_items):
    categories = [item["category"] for item in past_items]
    category_counts = {}
    for cat in categories:
        category_counts[cat] = category_counts.get(cat, 0) + 1

    top_category = max(category_counts, key=category_counts.get)

    example_menu = [
        {"name": "Truffle Pasta", "description": "Rich creamy truffle pasta", "category": "Pasta"},
        {"name": "Duck Confit", "description": "Slow-cooked duck leg", "category": "Meat"},
        {"name": "Lobster Bisque", "description": "Creamy lobster soup", "category": "Soup"},
        {"name": "Caesar Salad", "description": "Classic with anchovies", "category": "Salad"},
    ]

    return [item for item in example_menu if item["category"] == top_category]
