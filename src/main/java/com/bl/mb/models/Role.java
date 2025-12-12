package com.bl.mb.models;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.security.core.GrantedAuthority;

/**
 * Simple Role entity which also acts as GrantedAuthority for Spring Security.
 */
@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "role", schema = "library")
public class Role implements GrantedAuthority {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // e.g. "ADMIN", "USER"
    @Column(name = "name", nullable = false, unique = true, length = 50)
    private String name;

    @Override
    public String getAuthority() {
        return name;
    }
}
