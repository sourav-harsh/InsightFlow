package com.souravio.InsightFlow.dataset_service.auth;

public class AuthContextHolder {

    private static final ThreadLocal<String> currentUserId = new ThreadLocal<>();

    public static String getCurrentUserId() {
        return currentUserId.get();
    }

    static void setCurrentUserId(String userId) {
        currentUserId.set(userId);
    }

    static void clear() {
        currentUserId.remove();
    }

}
