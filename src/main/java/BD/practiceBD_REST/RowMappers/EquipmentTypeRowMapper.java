package BD.practiceBD_REST.RowMappers;

import BD.practiceBD_REST.Objects.EquipmentType;
import org.springframework.jdbc.core.RowMapper;
import java.sql.ResultSet;
import java.sql.SQLException;

public class EquipmentTypeRowMapper implements RowMapper<EquipmentType> {

    @Override
    public EquipmentType mapRow(ResultSet rs, int rowNum) throws SQLException {
        EquipmentType equipmentType = new EquipmentType();
        equipmentType.setId(rs.getInt("ид"));
        equipmentType.setCategory(rs.getString("категория"));
        equipmentType.setName(rs.getString("наименование"));
        equipmentType.setCharacteristic(rs.getString("характеристика"));
        return equipmentType;
    }
}