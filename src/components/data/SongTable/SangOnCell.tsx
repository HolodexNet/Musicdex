import { useTranslation } from "react-i18next";

export const SangOnGrid = ({ value }: { value: Date }) => {
  const { t } = useTranslation();
  return (
    <span title={t("NO_TL.absoluteDate", { date: value })}>
      {t("NO_TL.relativeDate", { date: value })}
    </span>
  );
};
