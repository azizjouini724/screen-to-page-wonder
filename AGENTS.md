<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

Patient demo preferences and reminder actions live in user-scoped SettingsContext and RemindersContext nested under AppointmentsProvider; appointment reminders are derived rather than stored so cancellation and rescheduling stay consistent.
Step 7 remains explicitly browser-local simulation as requested; password overrides use digests and account deletion suppresses local demo login, not a hosted account.
