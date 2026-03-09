import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { updatePageMeta } from "@/utils/seo";

const Marketing = () => {
  const navigate = useNavigate();

  useEffect(() => {
    updatePageMeta(
      "Marketing - Groei met online marketing",
      "Versterk je online aanwezigheid met onze marketing diensten. Van Google Ads tot social media campagnes en marketing automation."
    );
    // Redirect to unified configurator
    navigate("/pakketten", { replace: true });
  }, [navigate]);

  return null;
};

export default Marketing;
