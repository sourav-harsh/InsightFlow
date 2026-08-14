package com.souravio.InsightFlow.auth_service.service;

import com.souravio.InsightFlow.auth_service.dto.LoginRequestDTO;
import com.souravio.InsightFlow.auth_service.dto.SignupRequestDTO;
import com.souravio.InsightFlow.auth_service.dto.UserDTO;
import com.souravio.InsightFlow.auth_service.entity.User;
import com.souravio.InsightFlow.auth_service.exception.BadRequestException;
import com.souravio.InsightFlow.auth_service.exception.ResourceNotFoundException;
import com.souravio.InsightFlow.auth_service.repository.AuthRepository;
import com.souravio.InsightFlow.auth_service.utils.BCrypt;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {
  private final AuthRepository authRepository;
  private final ModelMapper modelMapper;
  private final JwtService jwtService;

  public UserDTO register(SignupRequestDTO signupRequestDto) {
    log.info("Signup a user with email: {}", signupRequestDto.getEmail());

    boolean exists = authRepository.existsByEmail(signupRequestDto.getEmail());
    if (exists) {
      log.error("User with email {} already exists", signupRequestDto.getEmail());
      throw new BadRequestException("User already exists");
    }

    if (signupRequestDto.getFirstName().isEmpty()
        || signupRequestDto.getFirstName().isBlank()
        || signupRequestDto.getEmail().isEmpty()
        || signupRequestDto.getEmail().isBlank()) {
      log.error("Invalid user details. Please provide valid user details");
      throw new BadRequestException("Invalid user details. Please provide valid user details");
    }

    User user = modelMapper.map(signupRequestDto, User.class);
    user.setPasswordHash(BCrypt.hash(signupRequestDto.getPassword()));

    log.info("User entity created!!");
    log.debug("User entity {}!!", user);

    user = authRepository.save(user);

    log.info("User entity saved!!");

    return modelMapper.map(user, UserDTO.class);
  }

  public String[] login(LoginRequestDTO loginRequestDto) {
    log.info("Login request for user with email: {}", loginRequestDto.getEmail());

    User user =
        authRepository
            .findByEmail(loginRequestDto.getEmail())
            .orElseThrow(
                () -> {
                  log.error("User not found with email: {}", loginRequestDto.getEmail());
                  return new ResourceNotFoundException("Incorrect email. Please check your email.");
                });

    boolean isPasswordMatch = BCrypt.match(loginRequestDto.getPassword(), user.getPasswordHash());

    if (!isPasswordMatch) {
      log.error("Incorrect password");
      throw new BadRequestException("Incorrect email or password");
    }

    log.info("User logged in successfully");
    log.debug("User {} logged in successfully", user);

    String[] arr = new String[2];
    arr[0] = jwtService.generateAccessToken(user);
    arr[1] = jwtService.generateRefreshToken(user);
    log.debug("Access token: {}", arr[0]);
    log.debug("Refresh token: {}", arr[1]);
    return arr;
  }

  public String refreshToken(String refreshToken) {
    log.info("Refreshing token for user with refresh token: {}", refreshToken);
    UUID userId = jwtService.getUserIdFromToken(refreshToken);
    log.debug("User id: {}", userId);
    log.debug("Generating access token for user with id: {}", userId);
    User user =
        authRepository
            .findById(userId)
            .orElseThrow(
                () -> {
                  log.error("User not found with id: {}", userId);
                  return new ResourceNotFoundException("User not found.");
                });
    log.debug("User {} found", user);
    log.info("Access token generated for user with id: {}", userId);
    return jwtService.generateAccessToken(user);
  }
}
