package com.tripura.backend.controller;

import com.tripura.backend.model.Product;
import com.tripura.backend.service.ProductService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    /**
     * Public: Get all active products and live pricing
     */
    @GetMapping("/products")
    public ResponseEntity<List<Product>> getActiveProducts() {
        return ResponseEntity.ok(productService.getAllActiveProducts());
    }

    /**
     * Public: Get product by slug
     */
    @GetMapping("/products/{slug}")
    public ResponseEntity<Product> getProductBySlug(@PathVariable String slug) {
        return productService.getProductBySlug(slug)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Admin: Get all products
     */
    @GetMapping("/admin/products")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Product>> getAllProductsForAdmin() {
        return ResponseEntity.ok(productService.getAllProductsForAdmin());
    }

    /**
     * Admin: Create product
     */
    @PostMapping("/admin/products")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Product> createProduct(@RequestBody Product product, Authentication auth) {
        String adminEmail = auth != null ? auth.getName() : "admin@tripura.org";
        return ResponseEntity.ok(productService.createProduct(product, adminEmail));
    }

    /**
     * Admin: Update product/pricing
     */
    @PutMapping("/admin/products/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Product> updateProduct(
            @PathVariable Long id,
            @RequestBody Product product,
            Authentication auth) {
        String adminEmail = auth != null ? auth.getName() : "admin@tripura.org";
        return ResponseEntity.ok(productService.updateProduct(id, product, adminEmail));
    }
}
