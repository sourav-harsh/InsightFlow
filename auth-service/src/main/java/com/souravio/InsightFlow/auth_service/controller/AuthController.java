package com.souravio.InsightFlow.auth_service.controller;

import com.souravio.InsightFlow.auth_service.dto.LoginRequestDTO;
import com.souravio.InsightFlow.auth_service.dto.LoginResponseDTO;
import com.souravio.InsightFlow.auth_service.dto.SignupRequestDTO;
import com.souravio.InsightFlow.auth_service.dto.UserDTO;
import com.souravio.InsightFlow.auth_service.exception.ResourceNotFoundException;
import com.souravio.InsightFlow.auth_service.service.AuthService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Arrays;

@RestController
@RequiredArgsConstructor
@Slf4j
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<UserDTO> register(@Valid @RequestBody SignupRequestDTO signupRequestDto) {
        log.info("Registering user with email: {}", signupRequestDto.getEmail());
        UserDTO userDto = authService.register(signupRequestDto);
        return new ResponseEntity<>(userDto, HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> login(@Valid @RequestBody LoginRequestDTO loginRequestDto, HttpServletResponse response) {
        log.info("User login with email: {}", loginRequestDto.getEmail());
        String[] token = authService.login(loginRequestDto);
        log.info("User logged in successfully");
        Cookie cookie = new Cookie("refreshToken", token[1]);
        log.info("Setting cookie");
        cookie.setHttpOnly(true);

        response.addCookie(cookie);
        log.info("Cookie set successfully");
        log.info("Creating login response");
        LoginResponseDTO loginRequestDTO = LoginResponseDTO
                .builder()
                .accessToken(token[0])
                .refreshToken(token[1])
                .build();
        log.info("Login responses");
    return ResponseEntity.ok(loginRequestDTO);
    }

    @PostMapping("/refresh")
    public ResponseEntity<LoginResponseDTO> refreshToken(HttpServletRequest httpServletRequest) {
        log.info("User refresh token");
        String refreshToken =
                Arrays.stream(httpServletRequest.getCookies())
                        .filter(cookie -> "refreshToken".equals(cookie.getName()))
                        .map(Cookie::getValue)
                        .findFirst()
                        .orElseThrow(
                                () -> {
                                    log.error("Refresh token not found");
                                    return new ResourceNotFoundException("Refresh token not found inside the Cookies");
                                });

        log.info("Refresh token found");

        String token = authService.refreshToken(refreshToken);
        log.info("Refresh token processed");
        log.info("Creating refresh token response");

        LoginResponseDTO loginResponseDTO = LoginResponseDTO
                .builder()
                .refreshToken(token)
                .build();
        log.info("Refresh token response created");
        return ResponseEntity.ok(loginResponseDTO);
    }
}
