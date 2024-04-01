package BD.practiceBD_REST.RowMappers;

import BD.practiceBD_REST.Objects.Maintenance;
import org.springframework.jdbc.core.RowMapper;
import java.sql.ResultSet;
import java.sql.SQLException;

public class MaintenanceRowMapper implements RowMapper<Maintenance> {

    @Override
    public Maintenance mapRow(ResultSet rs, int rowNum) throws SQLException {
        Maintenance maintenance = new Maintenance();
        maintenance.setId(rs.getInt("ид"));
        maintenance.setId_seat(rs.getInt("ид_учебного_места"));
        maintenance.setId_equipment(rs.getInt("ид_оборудования"));
        maintenance.setInstallation_date(rs.getString("дата_установки"));
        maintenance.setRemoval_date(rs.getString("дата_снятия"));
        return maintenance;
    }
}
