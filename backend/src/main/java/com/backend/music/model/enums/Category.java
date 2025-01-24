package com.backend.music.model.enums;

public enum Category {
    SINGLE("Single"),
    EP("EP"),
    ALBUM("Album"),
    COMPILATION("Compilation"),
    SOUNDTRACK("Soundtrack");

    private final String displayName;

    Category(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
} 