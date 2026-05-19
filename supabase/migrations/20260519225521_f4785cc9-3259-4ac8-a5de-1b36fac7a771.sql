DO $$
DECLARE
  r RECORD;
  uid uuid;
BEGIN
  FOR r IN SELECT * FROM (VALUES
    ('superadmin@parcelgrid.demo','Selam Admin','super_admin'),
    ('manager@parcelgrid.demo','Bekele Manager','branch_manager'),
    ('agent@parcelgrid.demo','Hanna Agent','agent'),
    ('driver@parcelgrid.demo','Dawit Driver','driver'),
    ('customer@parcelgrid.demo','Liya Customer','customer')
  ) AS t(email, full_name, role)
  LOOP
    SELECT id INTO uid FROM auth.users WHERE email = r.email;
    IF uid IS NULL THEN
      uid := gen_random_uuid();
      INSERT INTO auth.users (
        id, instance_id, aud, role, email, encrypted_password,
        email_confirmed_at, raw_app_meta_data, raw_user_meta_data,
        created_at, updated_at,
        confirmation_token, email_change, email_change_token_new, recovery_token
      ) VALUES (
        uid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
        r.email, crypt('demo123456', gen_salt('bf')),
        now(),
        '{"provider":"email","providers":["email"]}'::jsonb,
        jsonb_build_object('full_name', r.full_name),
        now(), now(), '', '', '', ''
      );
    END IF;

    IF r.role <> 'customer' THEN
      DELETE FROM public.user_roles WHERE user_id = uid AND role = 'customer';
    END IF;
    INSERT INTO public.user_roles (user_id, role)
    VALUES (uid, r.role::public.app_role)
    ON CONFLICT (user_id, role) DO NOTHING;
  END LOOP;
END $$;