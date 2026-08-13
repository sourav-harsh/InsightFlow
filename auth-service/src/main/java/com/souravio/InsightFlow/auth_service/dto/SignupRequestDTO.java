package com.souravio.InsightFlow.auth_service.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class SignupRequestDTO {

    @NotBlank(message = "First name is required")
    @Size(
            min = 2,
            max = 25,
            message = "First name must be between 2 and 25 characters"
    )
    private String firstName;

    @Size(
            max = 25,
            message = "Last name must not exceed 25 characters"
    )
    private String lastName;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    @NotBlank(message = "Password is required")
    @Size(
            min = 8,
            max = 30,
            message = "Password must be between 8 and 30 characters"
    )
    @Pattern(
            regexp = "^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[@#$%^&+=!_]).*$",
            message = "Password must contain at least one letter, one number, and one special character"
    )
    private String password;
}
