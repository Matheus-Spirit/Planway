package com.planway.trabalhoInterdiciplinar.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.planway.trabalhoInterdiciplinar.Entity.User;

public interface UserRepository extends JpaRepository<User, Long> {
}
