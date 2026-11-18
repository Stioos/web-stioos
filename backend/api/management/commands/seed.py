"""
Seed the Django DB from backend/fixtures/seed.json.
After loaddata, re-hash the plain-text demo passwords stored in the fixture
so Django's auth hashers verify them on login.
"""
from django.core.management.base import BaseCommand
from django.core.management import call_command
from django.contrib.auth.hashers import make_password

from api.models import User, AdminUser


class Command(BaseCommand):
    help = "Load the STIOOS seed fixture and hash demo passwords."

    def handle(self, *args, **options):
        # Wipe + reload deterministically so re-seeding is idempotent.
        call_command("flush", interactive=False, verbosity=0)
        call_command("loaddata", "seed.json", verbosity=1)

        hashed = 0
        for u in User.objects.all():
            # The fixture stores the plain demo password; hash it now.
            if u.password and not u.password.startswith(("bcrypt$", "pbkdf2_", "argon2")):
                u.password = make_password(u.password)
                u.save(update_fields=["password"])
                hashed += 1
        for a in AdminUser.objects.all():
            if a.password and not a.password.startswith(("bcrypt$", "pbkdf2_", "argon2")):
                a.password = make_password(a.password)
                a.save(update_fields=["password"])
                hashed += 1

        self.stdout.write(
            self.style.SUCCESS(
                f"✅ Seed complete: {User.objects.count()} users, "
                f"{AdminUser.objects.count()} admins, "
                f"{hashed} passwords hashed."
            )
        )
