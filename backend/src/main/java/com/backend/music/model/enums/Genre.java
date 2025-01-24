package com.backend.music.model.enums;

public enum Genre {
    ROCK("Rock"),
    POP("Pop"),
    JAZZ("Jazz"),
    CLASSICAL("Classical"),
    HIP_HOP("Hip Hop"),
    ELECTRONIC("Electronic"),
    BLUES("Blues"),
    COUNTRY("Country"),
    REGGAE("Reggae"),
    METAL("Metal"),
    FOLK("Folk"),
    R_AND_B("R&B"),
    SOUL("Soul"),
    FUNK("Funk"),
    INDIE("Indie"),
    ALTERNATIVE("Alternative"),
    PUNK("Punk"),
    LATIN("Latin"),
    WORLD("World Music");

    private final String displayName;

    Genre(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
} 