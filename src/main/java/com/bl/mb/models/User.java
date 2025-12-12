package com.bl.mb.models;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.UuidGenerator;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.sql.Timestamp;
import java.util.*;
import java.util.stream.Collectors;

/**
 * Implements UserDetails so it can be used directly by Spring Security.
 */
@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "users", schema = "library",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = "email"),
                @UniqueConstraint(columnNames = "username")
        })
public class User implements UserDetails {

    @Id
    @GeneratedValue
    @UuidGenerator(style = UuidGenerator.Style.TIME)
    @Column(name = "user_id", updatable = false, nullable = false)
    private UUID id;

    @Column(name = "created_on")
    private Timestamp createdOn;

    @Column(name = "updated_on")
    private Timestamp updatedOn;

    @Column(name = "full_name")
    private String fullName;

    @Column(name = "username", unique = true, nullable = false, length = 100)
    private String username;

    @Column(name = "email", unique = true, nullable = false, length = 100)
    private String email;

    @Column(name = "password", nullable = false)
    private String password;

    // Roles as EAGER so authorities are available immediately
    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "users_roles",
            joinColumns = @JoinColumn(name = "user_id", referencedColumnName = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "role_id", referencedColumnName = "id")
    )
    private Collection<Role> roles = new ArrayList<>();

    @Transient
    private String accessToken;

    @Transient
    private String refreshToken;

    // --- UserDetails methods ---

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return roles.stream().map(role -> (GrantedAuthority) role).collect(Collectors.toList());
    }

    @Override
    public String getPassword() {
        return password;
    }

    // getUsername() already present via Lombok-generated getter

    @Override
    public boolean isAccountNonExpired() {
        return true; // implement logic if needed
    }

    @Override
    public boolean isAccountNonLocked() {
        return true; // implement logic if needed
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true; // implement logic if needed
    }

    @Override
    public boolean isEnabled() {
        return true; // implement logic if needed
    }

    // equals & hashCode based on email (safe for identity in many apps)
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        User user = (User) o;
        return Objects.equals(email, user.email);
    }

    @Override
    public int hashCode() {
        return Objects.hash(email);
    }
}
