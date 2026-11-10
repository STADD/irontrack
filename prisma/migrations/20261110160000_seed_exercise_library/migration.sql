-- Seed a starter exercise library.
-- The NOT EXISTS checks make this safe to
-- re-run and avoid changing user-created records.

INSERT INTO "Exercise" (
    "id",
    "name",
    "machine",
    "muscleGroup",
    "description",
    "createdAt",
    "updatedAt"
)
SELECT
    gen_random_uuid()::text,
    seed."name",
    seed."machine",
    seed."muscleGroup",
    seed."description",
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
FROM (
    VALUES
    (
        'Barbell Bench Press',
        'Barbell',
        'Chest',
        'Horizontal barbell press targeting the chest, shoulders and triceps.'
    ),
    (
        'Chest Press',
        'Machine',
        'Chest',
        'Seated machine press targeting the chest.'
    ),
    (
        'Incline Dumbbell Press',
        'Dumbbells',
        'Chest',
        'Incline dumbbell press emphasizing the upper chest.'
    ),
    (
        'Cable Fly',
        'Cable Machine',
        'Chest',
        'Cable fly for controlled chest isolation.'
    ),
    (
        'Lat Pulldown',
        'Cable Machine',
        'Back',
        'Vertical pulling movement targeting the lats.'
    ),
    (
        'Seated Cable Row',
        'Cable Machine',
        'Back',
        'Horizontal cable row targeting the mid-back.'
    ),
    (
        'Barbell Row',
        'Barbell',
        'Back',
        'Bent-over barbell row for the back and posterior chain.'
    ),
    (
        'Pull-up',
        'Pull-up Bar',
        'Back',
        'Bodyweight vertical pull targeting the lats and arms.'
    ),
    (
        'Shoulder Press',
        'Machine',
        'Shoulders',
        'Seated machine overhead press.'
    ),
    (
        'Dumbbell Lateral Raise',
        'Dumbbells',
        'Shoulders',
        'Lateral raise targeting the side deltoids.'
    ),
    (
        'Bicep Curl',
        'Dumbbells',
        'Arms',
        'Elbow flexion movement targeting the biceps.'
    ),
    (
        'Tricep Pushdown',
        'Cable Machine',
        'Arms',
        'Cable elbow extension targeting the triceps.'
    ),
    (
        'Leg Press',
        'Machine',
        'Legs',
        'Machine compound movement targeting the quadriceps and glutes.'
    ),
    (
        'Barbell Squat',
        'Barbell',
        'Legs',
        'Compound squat targeting the quadriceps and glutes.'
    ),
    (
        'Leg Extension',
        'Machine',
        'Legs',
        'Knee extension movement targeting the quadriceps.'
    ),
    (
        'Leg Curl',
        'Machine',
        'Legs',
        'Knee flexion movement targeting the hamstrings.'
    ),
    (
        'Romanian Deadlift',
        'Barbell',
        'Legs',
        'Hip hinge movement targeting the hamstrings and glutes.'
    ),
    (
        'Standing Calf Raise',
        'Machine',
        'Calves',
        'Calf raise targeting the gastrocnemius and soleus.'
    )
) AS seed(
    "name",
    "machine",
    "muscleGroup",
    "description"
)
WHERE NOT EXISTS (
    SELECT 1
    FROM "Exercise" existing
    WHERE LOWER(existing."name") = LOWER(seed."name")
);