/**
 * 학년·학기(1~2)로 누적 학기 수 추정. 예: 4학년 1학기 → 7학기
 */
export function cumulativeSemesterFromGrade(
  grade: number | undefined,
  semester: number | undefined,
): number | null {
  if (grade == null || semester == null) return null;
  const g = Number(grade);
  const s = Number(semester);
  if (!Number.isFinite(g) || !Number.isFinite(s)) return null;
  const gi = Math.trunc(g);
  const si = Math.trunc(s);
  if (gi < 1 || si < 1) return null;
  return (gi - 1) * 2 + si;
}
