package com.pgh.api_practice.repository;

import com.pgh.api_practice.entity.RefreshToken;
import com.pgh.api_practice.entity.Users;
import org.springframework.data.repository.CrudRepository;

public interface RefreshTokenRepository extends CrudRepository<RefreshToken, Long> {
}


