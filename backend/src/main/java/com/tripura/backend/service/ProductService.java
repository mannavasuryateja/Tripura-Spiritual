package com.tripura.backend.service;

import com.tripura.backend.model.Product;
import com.tripura.backend.repository.ProductRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class ProductService {

    private final ProductRepository productRepository;
    private final AuditLogService auditLogService;

    public ProductService(ProductRepository productRepository, AuditLogService auditLogService) {
        this.productRepository = productRepository;
        this.auditLogService = auditLogService;
    }

    public List<Product> getAllActiveProducts() {
        return productRepository.findByIsActiveTrue();
    }

    public List<Product> getAllProductsForAdmin() {
        return productRepository.findAll();
    }

    public Optional<Product> getProductBySlug(String slug) {
        return productRepository.findBySlug(slug);
    }

    public Product getProductById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Product not found with ID: " + id));
    }

    @Transactional
    public Product createProduct(Product product, String adminEmail) {
        Product saved = productRepository.save(product);
        auditLogService.logAction(adminEmail, "PRODUCT_CREATED", "Product", saved.getId().toString(), "Created product: " + saved.getName() + " with price " + saved.getPrice());
        return saved;
    }

    @Transactional
    public Product updateProduct(Long id, Product details, String adminEmail) {
        Product existing = getProductById(id);
        existing.setName(details.getName());
        existing.setDescription(details.getDescription());
        existing.setPrice(details.getPrice());
        existing.setCurrency(details.getCurrency());
        existing.setType(details.getType());
        existing.setValidityDays(details.getValidityDays());
        existing.setIsActive(details.getIsActive());

        Product updated = productRepository.save(existing);
        auditLogService.logAction(adminEmail, "PRICE_CHANGED", "Product", id.toString(), "Updated product " + updated.getName() + " new price: ₹" + updated.getPrice());
        return updated;
    }
}
