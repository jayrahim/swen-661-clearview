import 'package:flutter/material.dart';

import '../models/appointment.dart';
import '../theme/app_colors.dart';
import '../theme/clearview_tokens.dart';
import 'surfaces.dart';

class AppointmentStatusPill extends StatelessWidget {
  const AppointmentStatusPill({super.key, required this.status});

  final AppointmentStatus status;

  @override
  Widget build(BuildContext context) {
    final style = AppointmentStatusStyle.forStatus(status);
    final tokens = context.clearViewTokens;
    return StatusPill(
      label: status.label,
      backgroundColor: tokens.isHighContrast
          ? tokens.surface
          : style.background,
      foregroundColor: style.foreground,
      borderColor: tokens.isHighContrast ? style.foreground : null,
    );
  }
}

class AppointmentStatusStyle {
  const AppointmentStatusStyle._(this.background, this.foreground);

  final Color background;
  final Color foreground;

  static const _confirmed = AppointmentStatusStyle._(
    AppColors.mint,
    AppColors.mintInk,
  );
  static const _needsAction = AppointmentStatusStyle._(
    AppColors.yellowTile,
    AppColors.warningInk,
  );

  static AppointmentStatusStyle forStatus(AppointmentStatus status) =>
      switch (status) {
        AppointmentStatus.confirmed => _confirmed,
        AppointmentStatus.needsAction => _needsAction,
      };
}
