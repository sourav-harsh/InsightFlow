package com.souravio.InsightFlow.auth_service.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Getter
@Setter
public class SignupRequestDTO {

    @NotEmpty(message = "First name is required")
    @NotNull
    @NotBlank
   @Size(min = 2, max = 25, message = "First name must be between 2 and 25 characters")
    private String firstName;

    @Max(25)
    private String lastName;

    @NotEmpty(message = "Email is required")
    @NotNull
    @NotBlank
    @Email
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min = 8, max = 30, message = "Password must be between 8 and 30 characters")
    @Pattern(
            regexp = "^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[@#$%^&+=!_]).*$",
            message = "Password must contain at least one letter, one number, and one special character"
    )
    private String password;
}
