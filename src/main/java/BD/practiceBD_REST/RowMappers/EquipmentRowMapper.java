package BD.practiceBD_REST.RowMappers;

import BD.practiceBD_REST.Objects.Equipment;
import org.springframework.jdbc.core.RowMapper;

import java.sql.ResultSet;
import java.sql.SQLException;

public class EquipmentRowMapper implements RowMapper<Equipment> {

    @Override
    public Equipment mapRow(ResultSet rs, int rowNum) throws SQLException {
        Equipment equipment = new Equipment();
        equipment.setId(rs.getInt("ид"));
        equipment.setId_equipmentType(rs.getInt("ид_типа_оборудования"));
        equipment.setInv_number(rs.getInt("инвентарный_номер"));
        equipment.setP_i(rs.getShort("признак_исправности"));
        equipment.setNote(rs.getString("примечание"));
        return equipment;
    }
}