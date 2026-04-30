-- habits テーブル
  CREATE TABLE IF NOT EXISTS habits (
    id          uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id     uuid NOT NULL REFERENCES auth.users(id),
    title       text NOT NULL,
    timeBlock   text NOT NULL,
    targetDays  integer NOT NULL,
    isCompleted boolean DEFAULT false,
    streakDays  integer DEFAULT 0,
    createdAt   timestamptz DEFAULT now(),
    completedAt timestamptz,
    updatedAt   timestamptz DEFAULT now()
  );

  -- pet テーブル
  CREATE TABLE IF NOT EXISTS pet (
    id         uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id    uuid NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE
    CASCADE,
    level      integer DEFAULT 1,
    emotion    text DEFAULT 'neutral',
    trust      integer DEFAULT 0,
    exhaustion integer DEFAULT 0,
    expression text DEFAULT 'neutral',
    updatedAt  timestamptz DEFAULT now()
  );

  -- pet_comment テーブル
  CREATE TABLE IF NOT EXISTS pet_comment (
    id         uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    pet_id     uuid REFERENCES pet(id),
    message    text NOT NULL,
    expression text,
    created_at timestamptz DEFAULT now()
  );

  -- lumi_consultation_history テーブル
  CREATE TABLE IF NOT EXISTS lumi_consultation_history (
    id          uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    pet_id      uuid REFERENCES pet(id),
    role        text,
    content     text,
    suggestions text[],
    created_at  timestamptz DEFAULT now()
  );
