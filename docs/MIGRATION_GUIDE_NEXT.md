# Migrating the Product List Challenge

This guide explains how to migrate the existing "Product List Challenge" from the coding-challenges app to its own standalone challenge app.

## Step 1: Create the new challenge app

```bash
npm run create:challenge product-list "Async Data Fetching"
```

## Step 2: Move challenge-specific files

1. Move the product-list component from the coding-challenges app to the new app:

```bash
# Create destination directories
mkdir -p projects/product-list/src/app/components/product-list

# Copy the component files
cp projects/coding-challenges/src/app/components/product-list/* projects/product-list/src/app/components/product-list/
```

2. Move the product service and model:

```bash
# Create destination directories
mkdir -p projects/product-list/src/app/services
mkdir -p projects/product-list/src/app/models

# Copy the service and model files
cp projects/coding-challenges/src/app/services/product.service.* projects/product-list/src/app/services/
cp projects/coding-challenges/src/app/shared/models/product.ts projects/product-list/src/app/models/
```

3. Move the REQUIREMENT.md file:

```bash
cp projects/coding-challenges/src/REQUIREMENT.md projects/product-list/src/REQUIREMENT.md
```

## Step 3: Update the new app.component.ts

Edit `projects/product-list/src/app/app.component.ts` to use the product-list component.

## Step 4: Update the app.routes.ts

Edit `projects/product-list/src/app/app.routes.ts` to include routes for the product-list component.

## Step 5: Update the app.module.ts or app.config.ts

Make sure to import HttpClientModule and any other required dependencies.

## Step 6: Test the new challenge app

```bash
npm run start:product-list
```

## Step 7: Clean up the coding-challenges app

Once the migration is successful, you can remove the product-list related files from the coding-challenges app if they are no longer needed.

## Note on Shared Code

If there are common utilities, interfaces, or services used across multiple challenges, consider moving them to the shared libraries:

- Common UI components: Move to `libs/shared/ui`
- Common models: Move to `libs/shared/models`
- Common services: Move to `libs/shared/services`
