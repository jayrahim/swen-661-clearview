import 'package:flutter/material.dart';

import 'app_colors.dart';

class ClearViewTokens extends ThemeExtension<ClearViewTokens> {
  const ClearViewTokens({
    required this.isHighContrast,
    required this.background,
    required this.surface,
    required this.ink,
    required this.mutedInk,
    required this.primary,
    required this.border,
    required this.borderWidth,
    required this.infoBackground,
    required this.infoBorder,
  });

  final bool isHighContrast;
  final Color background;
  final Color surface;
  final Color ink;
  final Color mutedInk;
  final Color primary;
  final Color border;
  final double borderWidth;
  final Color infoBackground;
  final Color infoBorder;

  static const normal = ClearViewTokens(
    isHighContrast: false,
    background: AppColors.background,
    surface: AppColors.surface,
    ink: AppColors.ink,
    mutedInk: AppColors.mutedInk,
    primary: AppColors.primary,
    border: AppColors.border,
    borderWidth: 1,
    infoBackground: AppColors.infoBackground,
    infoBorder: AppColors.infoBorder,
  );

  static const highContrast = ClearViewTokens(
    isHighContrast: true,
    background: AppColors.surface,
    surface: AppColors.surface,
    ink: AppColors.highContrastInk,
    mutedInk: AppColors.highContrastInk,
    primary: AppColors.highContrastPrimary,
    border: AppColors.highContrastInk,
    borderWidth: 2,
    infoBackground: AppColors.surface,
    infoBorder: AppColors.highContrastInk,
  );

  @override
  ClearViewTokens copyWith({
    bool? isHighContrast,
    Color? background,
    Color? surface,
    Color? ink,
    Color? mutedInk,
    Color? primary,
    Color? border,
    double? borderWidth,
    Color? infoBackground,
    Color? infoBorder,
  }) => ClearViewTokens(
    isHighContrast: isHighContrast ?? this.isHighContrast,
    background: background ?? this.background,
    surface: surface ?? this.surface,
    ink: ink ?? this.ink,
    mutedInk: mutedInk ?? this.mutedInk,
    primary: primary ?? this.primary,
    border: border ?? this.border,
    borderWidth: borderWidth ?? this.borderWidth,
    infoBackground: infoBackground ?? this.infoBackground,
    infoBorder: infoBorder ?? this.infoBorder,
  );

  @override
  // Tokens swap as a complete accessible palette; partial interpolation can
  // briefly create combinations that do not meet the intended contrast.
  ClearViewTokens lerp(covariant ClearViewTokens? other, double t) =>
      other ?? this;
}

extension ClearViewThemeContext on BuildContext {
  ClearViewTokens get clearViewTokens =>
      Theme.of(this).extension<ClearViewTokens>() ?? ClearViewTokens.normal;
}
