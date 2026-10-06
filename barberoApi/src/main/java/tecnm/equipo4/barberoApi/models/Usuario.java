package tecnm.equipo4.barberoApi.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Data

@Inheritance(strategy = InheritanceType.JOINED)
public class Usuario {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idUsuario;

    @Column(nullable = false)
    private String nombreCompleto;

    @Column(nullable = false, length = 10)
    private String telefono;

    @Column(nullable = false, length = 50)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String tipoUsuario;

    @Lob
    @Column(nullable = false, columnDefinition = "LONGBLOB")
    private byte[] perfil;
}