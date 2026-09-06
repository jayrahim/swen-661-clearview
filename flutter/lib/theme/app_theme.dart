import 'package:flutter/material.dart';

import 'clearview_tokens.dart';

abstract final class AppTheme {
  static ThemeData lightTheme({required bool highContrast}) {
    final tokens = highContrast
        ? ClearViewTokens.highContrast
        : ClearViewTokens.normal;
    return ThemeData(
      useMaterial3: true,
      scaffoldBackgroundColor: tokens.background,
      colorScheme: ColorScheme.light(
        primary: tokens.primary,
        onPrimary: Colors.white,
        surface: tokens.surface,
        onSurface: tokens.ink,
      ),
      fontFamily: 'Arial',
      textTheme: TextTheme(
        headlineLarge: TextStyle(
          color: tokens.ink,
          fontSize: 28,
          fontWeight: FontWeight.w700,
          height: 1.18,
        ),
        headlineMedium: TextStyle(
          color: tokens.ink,
          fontSize: 24,
          fontWeight: FontWeight.w700,
          height: 1.2,
        ),
        titleLarge: TextStyle(
          color: tokens.ink,
          fontSize: 20,
          fontWeight: FontWeight.w700,
        ),
        titleMedium: TextStyle(
          color: tokens.ink,
          fontSize: 16,
          fontWeight: FontWeight.w700,
        ),
        bodyLarge: TextStyle(color: tokens.ink, fontSize: 16, height: 1.2),
        bodyMedium: TextStyle(
          color: tokens.mutedInk,
          fontSize: 15,
          height: 1.25,
        ),
        labelLarge: TextStyle(fontSize: 16, fontWeight: FontWeight.w700),
      ),
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: tokens.surface,
        contentPadding: const EdgeInsets.symmetric(
          horizontal: 16,
          vertical: 17,
        ),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(10),
          borderSide: BorderSide(
            color: tokens.border,
            width: tokens.borderWidth,
          ),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(10),
          borderSide: BorderSide(
            color: tokens.border,
            width: tokens.borderWidth,
          ),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(10),
          borderSide: BorderSide(color: tokens.primary, width: 2),
        ),
      ),
      extensions: [tokens],
    );
  }
}
